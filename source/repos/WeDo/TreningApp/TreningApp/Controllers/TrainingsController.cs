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
    public class TrainingsController : ControllerBase
    {
        private readonly AppDbContext _context;

        public TrainingsController(AppDbContext context)
        {
            _context = context;
        }

        // GET: api/Trainings
        [HttpGet]
        public async Task<ActionResult<IEnumerable<TrainingDto>>> GetTrainings()
        {
            var trainings = await _context.Trainings.Include(t => t.User).ToListAsync();
            var trainingDtos = trainings.Select(t => new TrainingDto
            {
                Id = t.Id,
                UserId = t.UserId,
                ExerciseType = t.ExerciseType,
                Duration = t.Duration,
                Calories = t.Calories,
                Intensity = t.Intensity,
                Fatigue = t.Fatigue,
                Notes = t.Notes,
                TrainingDate = t.TrainingDate
            }).ToList();

            return trainingDtos;
        }

        // GET: api/Trainings/5
        [HttpGet("{id}")]
        public async Task<ActionResult<TrainingDto>> GetTraining(int id)
        {
            var training = await _context.Trainings.Include(t => t.User).FirstOrDefaultAsync(t => t.Id == id);

            if (training == null)
            {
                return NotFound();
            }

            var trainingDto = new TrainingDto
            {
                Id = training.Id,
                UserId = training.UserId,
                ExerciseType = training.ExerciseType,
                Duration = training.Duration,
                Calories = training.Calories,
                Intensity = training.Intensity,
                Fatigue = training.Fatigue,
                Notes = training.Notes,
                TrainingDate = training.TrainingDate
            };

            return trainingDto;
        }
        // GET: api/Trainings/user/5
        [HttpGet("user/{userId}")]
        public async Task<ActionResult<IEnumerable<TrainingDto>>> GetTrainingsByUserId(int userId)
        {
            var trainings = await _context.Trainings.Include(t => t.User)
                                                    .Where(t => t.UserId == userId)
                                                    .ToListAsync();

            if (trainings == null || !trainings.Any())
            {
                return NotFound();
            }

            var trainingDtos = trainings.Select(t => new TrainingDto
            {
                Id = t.Id,
                UserId = t.UserId,
                ExerciseType = t.ExerciseType,
                Duration = t.Duration,
                Calories = t.Calories,
                Intensity = t.Intensity,
                Fatigue = t.Fatigue,
                Notes = t.Notes,
                TrainingDate = t.TrainingDate
            }).ToList();

            return trainingDtos;
        }

        // POST: api/Trainings
        [HttpPost]
        public async Task<ActionResult<TrainingDto>> PostTraining(TrainingDto trainingDto)
        {
            var training = new Training
            {
                UserId = trainingDto.UserId,
                ExerciseType = trainingDto.ExerciseType,
                Duration = trainingDto.Duration,
                Calories = trainingDto.Calories,
                Intensity = trainingDto.Intensity,
                Fatigue = trainingDto.Fatigue,
                Notes = trainingDto.Notes,
                TrainingDate = trainingDto.TrainingDate
            };

            _context.Trainings.Add(training);
            await _context.SaveChangesAsync();

            trainingDto.Id = training.Id;

            return CreatedAtAction(nameof(GetTraining), new { id = trainingDto.Id }, trainingDto);
        }

        // PUT: api/Trainings/5
        [HttpPut("{id}")]
        public async Task<IActionResult> PutTraining(int id, TrainingDto trainingDto)
        {
            if (id != trainingDto.Id)
            {
                return BadRequest();
            }

            var training = await _context.Trainings.FindAsync(id);
            if (training == null)
            {
                return NotFound();
            }

            training.UserId = trainingDto.UserId;
            training.ExerciseType = trainingDto.ExerciseType;
            training.Duration = trainingDto.Duration;
            training.Calories = trainingDto.Calories;
            training.Intensity = trainingDto.Intensity;
            training.Fatigue = trainingDto.Fatigue;
            training.Notes = trainingDto.Notes;
            training.TrainingDate = trainingDto.TrainingDate;

            _context.Entry(training).State = EntityState.Modified;

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!TrainingExists(id))
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

        // DELETE: api/Trainings/5
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteTraining(int id)
        {
            var training = await _context.Trainings.FindAsync(id);
            if (training == null)
            {
                return NotFound();
            }

            _context.Trainings.Remove(training);
            await _context.SaveChangesAsync();

            return NoContent();
        }
        // GET: api/Trainings/week?date=2024-06-01&userId=5
        [HttpGet("week")]
        public async Task<ActionResult<IEnumerable<TrainingDto>>> GetTrainingsByWeek(DateTime date, int userId)
        {
            // Calculate the start and end of the week
            var startOfWeek = date.Date.AddDays(-(int)date.DayOfWeek);
            var endOfWeek = startOfWeek.AddDays(7);

            var trainings = await _context.Trainings
                                          .Include(t => t.User)
                                          .Where(t => t.UserId == userId && t.TrainingDate >= startOfWeek && t.TrainingDate < endOfWeek)
                                          .ToListAsync();

            if (trainings == null || !trainings.Any())
            {
                return NotFound();
            }

            var trainingDtos = trainings.Select(t => new TrainingDto
            {
                Id = t.Id,
                UserId = t.UserId,
                ExerciseType = t.ExerciseType,
                Duration = t.Duration,
                Calories = t.Calories,
                Intensity = t.Intensity,
                Fatigue = t.Fatigue,
                Notes = t.Notes,
                TrainingDate = t.TrainingDate
            }).ToList();

            return trainingDtos;
        }

        private bool TrainingExists(int id)
        {
            return _context.Trainings.Any(e => e.Id == id);
        }
    }
}
