using System;
using System.ComponentModel.DataAnnotations;
using Newtonsoft.Json;

namespace MINDMATE.Application.Chatbot.Dto
{
    public class ChatRequestDto
    {
        [Required]
        [StringLength(1000, MinimumLength = 1)]
        [JsonProperty("message")] // Map lowercase "message" to this property
        public string Message { get; set; }
    }
}
