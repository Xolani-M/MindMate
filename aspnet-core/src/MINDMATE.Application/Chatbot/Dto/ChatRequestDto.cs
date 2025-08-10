using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;

namespace MINDMATE.Application.Chatbot.Dto
{
    public class ChatRequestDto
    {
        [Required]
        [StringLength(1000, MinimumLength = 1)]
        public string Message { get; set; }
        
        /// <summary>
        /// Recent conversation history to provide context for the chatbot
        /// </summary>
        public List<ChatHistoryItem> ConversationHistory { get; set; } = new List<ChatHistoryItem>();
    }
    
    public class ChatHistoryItem
    {
        public string Sender { get; set; } // "user" or "bot"
        public string Message { get; set; }
        public DateTime Timestamp { get; set; }
    }
}
