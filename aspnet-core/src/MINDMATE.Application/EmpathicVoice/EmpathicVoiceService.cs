using System;
using System.Net.Http;
using System.Net.Http.Headers;
using System.Text;
using System.Threading.Tasks;
using Microsoft.Extensions.Configuration;
using Newtonsoft.Json;
using Abp.Dependency;
using Abp.Application.Services;
using System.Collections.Generic;

namespace MINDMATE.Application.EmpathicVoice
{

using MINDMATE.Application.EmpathicVoice.Dto;

    public class EmpathicVoiceService : IApplicationService
    {
        private readonly string _apiKey;
        private readonly string _secretKey;
        private readonly string _webSocketUrl;
        private readonly string _authUrl;
        private readonly string _configUrl;
        private readonly HttpClient _httpClient;

        /// <summary>
        /// Initializes a new instance of the EmpathicVoiceService class.
        /// </summary>
        public EmpathicVoiceService(IConfiguration configuration)
        {
            var humeConfig = configuration.GetSection("HumeAI");
            _apiKey = humeConfig["ApiKey"];
            _secretKey = humeConfig["SecretKey"];
            // Use the required Hume AI endpoints
            _webSocketUrl = "wss://api.hume.ai/v0/evi/chat";
            _authUrl = "https://api.hume.ai/oauth2-cc/token";
            _configUrl = humeConfig["ConfigUrl"];
            _httpClient = new HttpClient();
        }

        /// <summary>
        /// Generates an access token using API key and secret key.
        /// </summary>
    /// <summary>
    /// Generates an access token for authenticating with Hume AI API.
    /// </summary>
    /// <returns>The OAuth2 access token string.</returns>
    public async Task<string> GenerateAccessTokenAsync()
        {
            try
            {
                // Clear any existing authorization headers
                _httpClient.DefaultRequestHeaders.Authorization = null;
                
                // Use form-encoded data, not JSON
                var requestBody = "grant_type=client_credentials";
                var content = new StringContent(requestBody, Encoding.UTF8, "application/x-www-form-urlencoded");
                
                // Add basic authentication header
                var authValue = Convert.ToBase64String(Encoding.UTF8.GetBytes($"{_apiKey}:{_secretKey}"));
                _httpClient.DefaultRequestHeaders.Authorization = new AuthenticationHeaderValue("Basic", authValue);
                
                Console.WriteLine($"Requesting access token from: {_authUrl}");
                var response = await _httpClient.PostAsync(_authUrl, content);
                
                var responseBody = await response.Content.ReadAsStringAsync();
                Console.WriteLine($"Token response: {response.StatusCode}");
                
                response.EnsureSuccessStatusCode();
                dynamic result = JsonConvert.DeserializeObject(responseBody);
                string accessToken = result.access_token;
                
                Console.WriteLine($"Access token generated successfully: {accessToken.Substring(0, 20)}...");
                return accessToken;
            }
            catch (Exception ex)
            {
                Console.WriteLine($"Error generating access token: {ex.Message}");
                throw;
            }
        }

        /// <summary>
        /// Creates a new EVI config for Hume AI.
        /// </summary>
    /// <summary>
    /// Creates a new EVI configuration for Hume AI chat sessions.
    /// </summary>
    /// <param name="configName">The name of the configuration.</param>
    /// <param name="promptText">The prompt text for the assistant.</param>
    /// <param name="voiceName">The name of the voice to use.</param>
    /// <returns>The raw response from the Hume AI config API.</returns>
    public async Task<string> CreateEviConfigAsync(string configName, string promptText, string voiceName)
        {
            var accessToken = await GenerateAccessTokenAsync();
            _httpClient.DefaultRequestHeaders.Authorization = new AuthenticationHeaderValue("Bearer", accessToken);

            var configBody = new
            {
                evi_version = "3",
                name = configName,
                prompt = new { text = promptText },
                voice = new { name = voiceName, provider = "HUME_AI" },
                language_model = new { model_provider = "ANTHROPIC", model_resource = "claude-3-5-sonnet-20241022", temperature = 1 },
                event_messages = new
                {
                    on_new_chat = new { enabled = true, text = "Welcome to MindMate!" },
                    on_inactivity_timeout = new { enabled = true, text = "Are you still there?" },
                    on_max_duration_timeout = new { enabled = true, text = "Session ended due to time limit." }
                },
                timeouts = new
                {
                    inactivity = new { enabled = true, duration_secs = 600 },
                    max_duration = new { enabled = true, duration_secs = 1800 }
                }
            };

            var content = new StringContent(JsonConvert.SerializeObject(configBody), Encoding.UTF8, "application/json");
            var response = await _httpClient.PostAsync(_configUrl, content);
            response.EnsureSuccessStatusCode();
            var responseBody = await response.Content.ReadAsStringAsync();
            return responseBody;
        }

        /// <summary>
        /// Initiates a text-only chat session with Hume AI EVI.
        /// </summary>
        /// <param name="userText">The user's message to send.</param>
        /// <param name="configId">Optional EVI config ID.</param>
    /// <summary>
    /// Initiates a text-only chat session with Hume AI EVI.
    /// </summary>
    /// <param name="userText">The user's message to send.</param>
    /// <param name="configId">Optional EVI config ID.</param>
    /// <returns>A <see cref="ChatResponse"/> containing chat results.</returns>
    public async Task<ChatResponse> ChatWithEviTextAsync(string userText, string configId = null)
        {
            if (string.IsNullOrEmpty(userText))
                throw new ArgumentException("userText parameter is required", nameof(userText));
            return await ChatWithEviAsync(userText: userText, configId: configId);
        }

        /// <summary>
        /// Initiates an audio chat session with Hume AI EVI.
        /// </summary>
        /// <param name="audioData">Audio data as byte array.</param>
        /// <param name="userText">Optional user text.</param>
        /// <param name="configId">Optional EVI config ID.</param>
    /// <summary>
    /// Initiates an audio chat session with Hume AI EVI.
    /// </summary>
    /// <param name="audioData">Audio data as byte array.</param>
    /// <param name="userText">Optional user text.</param>
    /// <param name="configId">Optional EVI config ID.</param>
    /// <returns>A <see cref="ChatResponse"/> containing chat results.</returns>
    public async Task<ChatResponse> ChatWithEviAudioAsync(byte[] audioData, string userText = null, string configId = null)
        {
            if (audioData == null || audioData.Length == 0)
                throw new ArgumentException("audioData is required and cannot be empty", nameof(audioData));
            return await ChatWithEviAsync(userText: userText, audioData: audioData, configId: configId);
        }

        /// <summary>
        /// Initiates a chat session with Hume AI EVI using text and/or audio input.
        /// </summary>
        /// <param name="userText">The user's message to send.</param>
        /// <param name="audioData">Optional audio data as byte array.</param>
        /// <param name="configId">Optional EVI config ID.</param>
    /// <summary>
    /// Initiates a chat session with Hume AI EVI using text and/or audio input.
    /// </summary>
    /// <param name="userText">The user's message to send.</param>
    /// <param name="audioData">Optional audio data as byte array.</param>
    /// <param name="configId">Optional EVI config ID.</param>
    /// <returns>A <see cref="ChatResponse"/> containing chat results.</returns>
    public async Task<ChatResponse> ChatWithEviAsync(string userText = null, byte[] audioData = null, string configId = null)
        {
            var chatResponse = new ChatResponse();
            
            try
            {
                Console.WriteLine("Starting EVI chat session...");
                var accessToken = await GenerateAccessTokenAsync();
                
                // Build WebSocket URL with access token as query parameter
                var wsUrl = $"{_webSocketUrl}?access_token={accessToken}";
                if (!string.IsNullOrEmpty(configId))
                {
                    wsUrl += $"&config_id={configId}";
                }
                
                Console.WriteLine($"Connecting to WebSocket: {wsUrl.Substring(0, wsUrl.IndexOf("?"))}?access_token=***");

                using (var ws = new WebSocketSharp.WebSocket(wsUrl))
                {
                    var tcs = new TaskCompletionSource<bool>();
                    var connectionEstablished = false;
                    var receivedResponse = false;
                    var messageSent = false;
                    
                    ws.OnOpen += (sender, e) =>
                    {
                        Console.WriteLine("WebSocket connection opened successfully");
                        connectionEstablished = true;
                    };

                    ws.OnMessage += (sender, e) =>
                    {
                        try
                        {
                            Console.WriteLine($"Received WebSocket message: {e.Data}");
                            dynamic message = JsonConvert.DeserializeObject(e.Data);
                            var chatMessage = HandleEviResponse(message);
                            if (chatMessage != null)
                            {
                                chatResponse.Messages.Add(chatMessage);
                            }

                            // Mark that we've received at least one response
                            receivedResponse = true;

                            // Send user message after receiving chat metadata (if not already sent)
                            string messageType = message.type?.ToString();
                            if (messageType == "chat_metadata" && !messageSent && !string.IsNullOrEmpty(userText))
                            {
                                try
                                {
                                    var userInput = new
                                    {
                                        type = "user_input",
                                        text = userText
                                    };
                                    var messageJson = JsonConvert.SerializeObject(userInput);
                                    Console.WriteLine($"Sending user input after metadata: {messageJson}");
                                    ws.Send(messageJson);
                                    messageSent = true;
                                }
                                catch (Exception sendEx)
                                {
                                    Console.WriteLine($"Error sending user input: {sendEx.Message}");
                                    chatResponse.Error = $"Error sending user input: {sendEx.Message}";
                                    chatResponse.Success = false;
                                    tcs.TrySetResult(false);
                                    return;
                                }
                            }

                            // Check for conversation completion
                            if (messageType == "assistant_end")
                            {
                                Console.WriteLine("Received assistant_end - conversation complete");
                                Task.Delay(1000).ContinueWith(_ => 
                                {
                                    if (!tcs.Task.IsCompleted)
                                    {
                                        tcs.TrySetResult(true);
                                    }
                                });
                            }
                        }
                        catch (Exception ex)
                        {
                            Console.WriteLine($"Error parsing WebSocket message: {ex.Message}");
                            chatResponse.Error = $"Error parsing message: {ex.Message}";
                            chatResponse.Success = false;
                            tcs.TrySetResult(false);
                        }
                    };

                    ws.OnError += (sender, e) =>
                    {
                        Console.WriteLine($"WebSocket Error: {e.Message}");
                        if (e.Exception != null)
                        {
                            Console.WriteLine($"Exception details: {e.Exception}");
                            Console.WriteLine($"Stack trace: {e.Exception.StackTrace}");
                        }
                        chatResponse.Error = $"WebSocket Error: {e.Message}";
                        chatResponse.Success = false;
                        tcs.TrySetResult(false);
                    };

                    ws.OnClose += (sender, e) =>
                    {
                        Console.WriteLine($"WebSocket closed: Code={e.Code}, Reason={e.Reason}, WasClean={e.WasClean}");
                        if (!tcs.Task.IsCompleted)
                        {
                            if (receivedResponse && chatResponse.Messages.Count > 0)
                            {
                                tcs.TrySetResult(true);
                            }
                            else
                            {
                                chatResponse.Error = $"WebSocket closed before receiving meaningful response: {e.Reason}";
                                chatResponse.Success = false;
                                tcs.TrySetResult(false);
                            }
                        }
                    };

                    // Connect to WebSocket
                    Console.WriteLine("Initiating WebSocket connection...");
                    ws.Connect();
                    
                    // Wait for connection to be established
                    int connectionWaitMs = 0;
                    while (!connectionEstablished && connectionWaitMs < 5000)
                    {
                        await Task.Delay(100);
                        connectionWaitMs += 100;
                    }
                    
                    if (!connectionEstablished)
                    {
                        chatResponse.Error = "Failed to establish WebSocket connection within 5 seconds";
                        chatResponse.Success = false;
                        return chatResponse;
                    }
                    
                    Console.WriteLine("WebSocket connected, waiting for chat metadata...");
                    
                    // Wait for response or timeout
                    var timeoutTask = Task.Delay(30000); // 30 second timeout
                    var completedTask = await Task.WhenAny(tcs.Task, timeoutTask);
                    
                    if (completedTask == timeoutTask)
                    {
                        // Try to send message one more time if we haven't received any responses
                        if (!receivedResponse && !messageSent && !string.IsNullOrEmpty(userText))
                        {
                            try
                            {
                                Console.WriteLine("Timeout reached, attempting to send message directly...");
                                var userInput = new
                                {
                                    type = "user_input", 
                                    text = userText
                                };
                                ws.Send(JsonConvert.SerializeObject(userInput));
                                
                                // Wait a bit more for response
                                var extraWait = Task.Delay(10000);
                                var result = await Task.WhenAny(tcs.Task, extraWait);
                                
                                if (result == extraWait)
                                {
                                    chatResponse.Error = "Timeout waiting for EVI response after direct message send";
                                    chatResponse.Success = false;
                                }
                            }
                            catch (Exception timeoutEx)
                            {
                                Console.WriteLine($"Error during timeout recovery: {timeoutEx.Message}");
                                chatResponse.Error = "Timeout waiting for EVI response";
                                chatResponse.Success = false;
                            }
                        }
                        else
                        {
                            chatResponse.Error = "Timeout waiting for EVI response";
                            chatResponse.Success = false;
                        }
                        
                        Console.WriteLine("Timeout reached");
                    }
                    
                    // Clean close
                    try
                    {
                        if (ws.ReadyState == WebSocketSharp.WebSocketState.Open)
                        {
                            Console.WriteLine("Closing WebSocket connection cleanly...");
                            ws.Close(WebSocketSharp.CloseStatusCode.Normal, "Session completed");
                        }
                    }
                    catch (Exception closeEx)
                    {
                        Console.WriteLine($"Error during WebSocket close: {closeEx.Message}");
                    }
                }

                Console.WriteLine($"Chat session completed. Success: {chatResponse.Success}, Messages: {chatResponse.Messages.Count}");
            }
            catch (Exception ex)
            {
                Console.WriteLine($"Exception in ChatWithEviAsync: {ex.Message}");
                Console.WriteLine($"Stack trace: {ex.StackTrace}");
                chatResponse.Error = $"Exception: {ex.Message}";
                chatResponse.Success = false;
            }
            
            return chatResponse;
        }

    /// <summary>
    /// Handles and parses a message received from Hume AI EVI.
    /// </summary>
    /// <param name="message">The dynamic message object received from the WebSocket.</param>
    /// <returns>A <see cref="ChatMessage"/> representing the parsed message.</returns>
    private ChatMessage HandleEviResponse(dynamic message)
        {
            try
            {
                string messageType = message.type?.ToString() ?? "unknown";
                Console.WriteLine($"Processing message type: {messageType}");
                
                switch (messageType)
                {
                    case "chat_metadata":
                        var chatId = message.chat_id?.ToString() ?? "";
                        var chatGroupId = message.chat_group_id?.ToString() ?? "";
                        Console.WriteLine($"Chat Metadata - Chat ID: {chatId}, Chat Group ID: {chatGroupId}");
                        return new ChatMessage
                        {
                            Type = "chat_metadata",
                            Content = $"Chat started - ID: {chatId}"
                        };
                        
                    case "assistant_message":
                        var assistantText = message.message?.content?.ToString() ?? "";
                        Console.WriteLine($"Assistant message: {assistantText}");
                        return new ChatMessage
                        {
                            Type = "assistant_message",
                            Content = assistantText
                        };
                        
                    case "audio_output":
                        Console.WriteLine("Received audio output");
                        var audioData = message.data?.ToString() ?? "";
                        if (!string.IsNullOrEmpty(audioData))
                        {
                            try
                            {
                                byte[] audioBytes = Convert.FromBase64String(audioData);
                                SaveAudioToFile(audioBytes, $"response_{DateTime.Now:yyyyMMdd_HHmmss}.wav");
                            }
                            catch (Exception ex)
                            {
                                Console.WriteLine($"Error processing audio data: {ex.Message}");
                            }
                        }
                        return new ChatMessage
                        {
                            Type = "audio_output",
                            Content = "Audio response received",
                            AudioData = audioData
                        };
                        
                    case "user_message":
                        var userText = message.message?.content?.ToString() ?? "";
                        Console.WriteLine($"User message (transcribed): {userText}");
                        return new ChatMessage
                        {
                            Type = "user_message",
                            Content = userText
                        };
                        
                    case "assistant_end":
                        Console.WriteLine("Assistant finished speaking");
                        return new ChatMessage
                        {
                            Type = "assistant_end",
                            Content = "Response complete"
                        };

                    case "error":
                        var errorMsg = message.message?.ToString() ?? message.error?.ToString() ?? "Unknown error";
                        Console.WriteLine($"EVI Error: {errorMsg}");
                        return new ChatMessage
                        {
                            Type = "error",
                            Content = errorMsg
                        };
                        
                    default:
                        Console.WriteLine($"Unhandled message type: {messageType}");
                        Console.WriteLine($"Full message: {JsonConvert.SerializeObject(message)}");
                        return new ChatMessage
                        {
                            Type = messageType,
                            Content = JsonConvert.SerializeObject(message)
                        };
                }
            }
            catch (Exception ex)
            {
                Console.WriteLine($"Error handling EVI response: {ex.Message}");
                Console.WriteLine($"Raw message: {message}");
                return new ChatMessage
                {
                    Type = "error",
                    Content = $"Error handling response: {ex.Message}"
                };
            }
        }

        private void SaveAudioToFile(byte[] audioData, string filename)
        {
            try
            {
                System.IO.File.WriteAllBytes(filename, audioData);
                Console.WriteLine($"Audio saved to: {filename}");
            }
            catch (Exception ex)
            {
                Console.WriteLine($"Error saving audio file: {ex.Message}");
            }
        }
    }
}