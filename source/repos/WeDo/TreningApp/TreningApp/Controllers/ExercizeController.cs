using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using TreningApp.Data;
using TreningApp.Models;

namespace TreningApp.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class ExercisesController : ControllerBase
    {
        private readonly AppDbContext _context;

        public ExercisesController(AppDbContext context)
        {
            _context = context;
        }

        // GET: api/Exercises
        [HttpGet]
        public async Task<ActionResult<IEnumerable<ExercisesDto>>> GetExercises()
        {
            var exercises = await _context.Exercises.ToListAsync();
            var ExercisesDtos = exercises.Select(e => new ExercisesDto
            {
                Id = e.Id,
                Name = e.Name,
                Description = e.Description,
                TrainingId = e.TrainingId,
                UserId = e.UserId
            }).ToList();

            return Ok(ExercisesDtos);
        }

        // GET: api/Exercises/5
        [HttpGet("{id}")]
        public async Task<ActionResult<ExercisesDto>> GetExercise(int id)
        {
            var exercise = await _context.Exercises.FindAsync(id);

            if (exercise == null)
            {
                return NotFound();
            }

            var ExercisesDto = new ExercisesDto
            {
                Id = exercise.Id,
                Name = exercise.Name,
                Description = exercise.Description,
                TrainingId = exercise.TrainingId,
                UserId = exercise.UserId
            };

            return Ok(ExercisesDto);
        }

        // GET: api/Exercises/training/5/user/3
        [HttpGet("training/{trainingId}/user/{userId}")]
        public async Task<ActionResult<IEnumerable<ExercisesDto>>> GetExercisesByTrainingIdAndUserId(int trainingId, int userId)
        {
            var exercises = await _context.Exercises
                                          .Where(e => e.TrainingId == trainingId && e.UserId == userId)
                                          .ToListAsync();

            if (exercises == null || !exercises.Any())
            {
                return NotFound();
            }

            var ExercisesDtos = exercises.Select(e => new ExercisesDto
            {
                Id = e.Id,
                Name = e.Name,
                Description = e.Description,
                TrainingId = e.TrainingId,
                UserId = e.UserId
            }).ToList();

            return Ok(ExercisesDtos);
        }

        // POST: api/Exercises
        [HttpPost]
        public async Task<ActionResult<ExercisesDto>> PostExercise(ExercisesDto ExercisesDto)
        {
            var exercise = new Exercises
            {
                Name = ExercisesDto.Name,
                Description = ExercisesDto.Description,
                TrainingId = ExercisesDto.TrainingId,
                UserId = ExercisesDto.UserId
            };

            _context.Exercises.Add(exercise);
            await _context.SaveChangesAsync();

            ExercisesDto.Id = exercise.Id;

            return CreatedAtAction(nameof(GetExercise), new { id = ExercisesDto.Id }, ExercisesDto);
        }

        // PUT: api/Exercises/5
        [HttpPut("{id}")]
        public async Task<IActionResult> PutExercise(int id, ExercisesDto ExercisesDto)
        {
            if (id != ExercisesDto.Id)
            {
                return BadRequest();
            }

            var exercise = await _context.Exercises.FindAsync(id);
            if (exercise == null)
            {
                return NotFound();
            }

            exercise.Name = ExercisesDto.Name;
            exercise.Description = ExercisesDto.Description;
            exercise.TrainingId = ExercisesDto.TrainingId;
            exercise.UserId = ExercisesDto.UserId;

            _context.Entry(exercise).State = EntityState.Modified;

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!ExerciseExists(id))
                {
                    return NotFound();
                }
                else
                {
                    throw;
                }
            }

            return NoContent();
        }

        // DELETE: api/Exercises/5
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteExercise(int id)
        {
            var exercise = await _context.Exercises.FindAsync(id);
            if (exercise == null)
            {
                return NotFound();
            }

            _context.Exercises.Remove(exercise);
            await _context.SaveChangesAsync();

            return NoContent();
        }

        private bool ExerciseExists(int id)
        {
            return _context.Exercises.Any(e => e.Id == id);
        }
    }
}
