using Abp.Domain.Entities.Auditing;
using MINDMATE.Authorization.Users;
using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

public abstract class Person : FullAuditedEntity<Guid>
{
    [Required]
    [MaxLength(100)]
    public string Name { get; set; }

    [Required]
    [MaxLength(100)]
    public string Surname { get; set; }

    [Required]
    [EmailAddress]
    [MaxLength(255)]
    public string Email { get; set; }

    [NotMapped]
    public string UserName { get; set; }

    [NotMapped]
    public string Password { get; set; }

    public DateTime? DateOfBirth { get; set; }

    [MaxLength(20)]
    public string Gender { get; set; }

    [MaxLength(20)]
    public string ContactNumber { get; set; }

    public long? UserId { get; set; }

    [ForeignKey("UserId")]
    public virtual User UserAccount { get; set; }

}
