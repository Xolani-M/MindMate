using Abp.Application.Services;
using Abp.Authorization;
using Microsoft.AspNetCore.Mvc;
using MINDMATE.Application.Chatbot;
using MINDMATE.Application.Chatbot.Dto;
using System.Threading.Tasks;

namespace MINDMATE.Application.Chatbot
{
    [AbpAuthorize]
    public class ChatAppService : ApplicationService
    {
        private readonly ChatbotService _chatbotService;

        public ChatAppService(ChatbotService chatbotService)
        {
            _chatbotService = chatbotService;
        }

        [HttpPost]
        public async Task<ChatResponseDto> GetChatbotReplyAsync([FromBody] ChatRequestDto request)
        {
            var reply = await _chatbotService.GetChatbotResponseAsync(request.Message);
            return new ChatResponseDto { Reply = reply };
        }
    }
}
