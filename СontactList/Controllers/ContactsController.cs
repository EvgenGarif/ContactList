using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging;
using NLog;
using СontactList.Data;
using СontactList.Models;

namespace CotactList.Controllers
{
    [Authorize]
    [ApiController]
    [Route("api/[controller]")]
    public class ContactsController : ControllerBase
    {
        private readonly ILogger<ContactsController> _logger;
        ApplicationDbContext db;
        public ContactsController(ApplicationDbContext context, ILogger<ContactsController> logger)
        {
            db = context;
            _logger = logger;
            if (!db.Contacts.Any())
            {
                db.Contacts.Add(new Contact { Surname = "Иванов", Name = "Иван", Mail = "asd@mail.ru", Phone = "89191183853" });
                db.Contacts.Add(new Contact { Surname = "Сидров", Name = "Максим", Mail = "awasd@gmail.com", Phone = "89320113541" });
                db.SaveChanges();
            }
        }

        [HttpGet]
        public async Task<ActionResult<IEnumerable<Contact>>> Get()
        {
            _logger.LogInformation("Retrieved all contacts");
            return await db.Contacts.ToListAsync();
        }
        [HttpGet("{id}")]
        public async Task<ActionResult<Contact>> Get(int id)
        {
            Contact contact = await db.Contacts.FirstOrDefaultAsync(x => x.Id == id);
            if (contact == null)
            {
                _logger.LogError("Unable to retrieve contact");
                return NotFound();
            }
            _logger.LogInformation("Retrieved single contact");
            return new ObjectResult(contact);
        }

        // POST api/users
        [HttpPost]
        public async Task<ActionResult<Contact>> Post(Contact contact)
        {
            if (contact == null)
            {
                _logger.LogError("Unable to create new contact");
                return BadRequest();
            }
            _logger.LogInformation("Created new contact");
            db.Contacts.Add(contact);
            await db.SaveChangesAsync();
            return Ok(contact);
        }

        // PUT api/users/
        [HttpPut]
        public async Task<ActionResult<Contact>> Put(Contact contact)
        {
            if (contact == null)
            {
                return BadRequest();
            }
            if (!db.Contacts.Any(x => x.Id == contact.Id))
            {
                return NotFound();
            }
            _logger.LogInformation("Сontact changes");
            db.Update(contact);
            await db.SaveChangesAsync();
            return Ok(contact);
        }

        // DELETE api/users/5
        [HttpDelete("{id}")]
        public async Task<ActionResult<Contact>> Delete(int id)
        {
            Contact contact = db.Contacts.FirstOrDefault(x => x.Id == id);
            if (contact == null)
            {
                _logger.LogError("Сontact not found");
                return NotFound();
            }
            _logger.LogInformation("Delete contact");
            db.Contacts.Remove(contact);
            await db.SaveChangesAsync();
            return Ok(contact);
        }
    }
}
