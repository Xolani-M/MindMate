using System.Threading.Tasks;
using Abp.Application.Services;
using MINDMATE.Application.Chatbot;

using MINDMATE.Application.Chatbot.Dto;

namespace MINDMATE.Application.Chatbot
{
    public class ChatAppService : ApplicationService
    {
        private readonly ChatbotService _chatbotService;

        public ChatAppService(ChatbotService chatbotService)
        {
            _chatbotService = chatbotService;
        }

        public async Task<ChatResponseDto> GetChatbotReplyAsync(ChatRequestDto input)
        {
            var reply = await _chatbotService.GetChatbotResponseAsync(input.Message, input.SeekerId);
            return new ChatResponseDto { Reply = reply };
        }
    }
}
