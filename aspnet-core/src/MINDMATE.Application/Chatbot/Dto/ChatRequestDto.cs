using System;
using System.ComponentModel.DataAnnotations;

namespace MINDMATE.Application.Chatbot.Dto
{
    public class ChatRequestDto
    {
        [Required]
        [StringLength(1000, MinimumLength = 1)]
        public string Message { get; set; }
    }
}
