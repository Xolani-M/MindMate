using System;

namespace MINDMATE.Application.EmpathicVoice.Dto
{
    /// <summary>
    /// Represents a single message exchanged in a chat session with Hume AI EVI.
    /// </summary>
    public class ChatMessage
    {
        /// <summary>
        /// The type of the message (e.g., assistant_message, user_message, audio_output).
        /// </summary>
        public string Type { get; set; }

        /// <summary>
        /// The textual content of the message.
        /// </summary>
        public string Content { get; set; }

        /// <summary>
        /// Base64-encoded audio data, if present.
        /// </summary>
        public string AudioData { get; set; }

        /// <summary>
        /// The UTC timestamp when the message was created.
        /// </summary>
        public DateTime Timestamp { get; set; } = DateTime.UtcNow;
    }
}
