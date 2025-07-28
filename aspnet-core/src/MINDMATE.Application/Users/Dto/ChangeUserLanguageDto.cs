using System.ComponentModel.DataAnnotations;

namespace MINDMATE.Users.Dto
{
    public class ChangeUserLanguageDto
    {
        [Required]
        public string LanguageName { get; set; }
    }
}