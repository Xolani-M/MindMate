using System;
using System.Collections.Generic;

namespace MINDMATE.Application.EmpathicVoice.Dto
{
    /// <summary>
    /// Represents the response from a chat session with Hume AI EVI.
    /// </summary>
    public class ChatResponse
    {
        /// <summary>
        /// List of chat messages exchanged during the session.
        /// </summary>
        public List<ChatMessage> Messages { get; set; } = new List<ChatMessage>();

        /// <summary>
        /// Error message, if any occurred during the session.
        /// </summary>
        public string Error { get; set; }

        /// <summary>
        /// Indicates whether the chat session was successful.
        /// </summary>
        public bool Success { get; set; } = true;
    }
}
