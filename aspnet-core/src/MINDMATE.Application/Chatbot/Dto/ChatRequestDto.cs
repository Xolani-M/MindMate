using System;
namespace MINDMATE.Application.Chatbot.Dto
{
    public class ChatRequestDto
    {
        public string Message { get; set; }
        public Guid SeekerId { get; set; }
    }
}
