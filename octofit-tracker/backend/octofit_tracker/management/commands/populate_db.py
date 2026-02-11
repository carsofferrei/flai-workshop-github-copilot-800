from django.core.management.base import BaseCommand
from octofit_tracker.models import User, Team, Activity, Leaderboard, Workout
from datetime import datetime, timedelta
import random

class Command(BaseCommand):
    help = 'Populate the octofit_db database with test data'

    def handle(self, *args, **kwargs):
        self.stdout.write('Clearing existing data...')
        
        # Delete all existing data
        User.objects.all().delete()
        Team.objects.all().delete()
        Activity.objects.all().delete()
        Leaderboard.objects.all().delete()
        Workout.objects.all().delete()
        
        self.stdout.write(self.style.SUCCESS('Existing data cleared!'))
        
        # Create Teams
        self.stdout.write('Creating teams...')
        team_marvel = Team.objects.create(
            name='Team Marvel',
            description='Earth\'s Mightiest Heroes fighting for fitness',
            total_points=0
        )
        
        team_dc = Team.objects.create(
            name='Team DC',
            description='Justice League members battling for supremacy',
            total_points=0
        )
        
        self.stdout.write(self.style.SUCCESS(f'Created teams: {team_marvel.name}, {team_dc.name}'))
        
        # Create Marvel Users
        self.stdout.write('Creating Marvel superheroes...')
        marvel_users = [
            User.objects.create(name='Iron Man', email='tony.stark@marvel.com', team_id=str(team_marvel._id), total_points=0),
            User.objects.create(name='Captain America', email='steve.rogers@marvel.com', team_id=str(team_marvel._id), total_points=0),
            User.objects.create(name='Thor', email='thor.odinson@marvel.com', team_id=str(team_marvel._id), total_points=0),
            User.objects.create(name='Black Widow', email='natasha.romanoff@marvel.com', team_id=str(team_marvel._id), total_points=0),
            User.objects.create(name='Hulk', email='bruce.banner@marvel.com', team_id=str(team_marvel._id), total_points=0),
            User.objects.create(name='Spider-Man', email='peter.parker@marvel.com', team_id=str(team_marvel._id), total_points=0),
            User.objects.create(name='Doctor Strange', email='stephen.strange@marvel.com', team_id=str(team_marvel._id), total_points=0),
        ]
        
        # Create DC Users
        self.stdout.write('Creating DC superheroes...')
        dc_users = [
            User.objects.create(name='Superman', email='clark.kent@dc.com', team_id=str(team_dc._id), total_points=0),
            User.objects.create(name='Batman', email='bruce.wayne@dc.com', team_id=str(team_dc._id), total_points=0),
            User.objects.create(name='Wonder Woman', email='diana.prince@dc.com', team_id=str(team_dc._id), total_points=0),
            User.objects.create(name='Flash', email='barry.allen@dc.com', team_id=str(team_dc._id), total_points=0),
            User.objects.create(name='Aquaman', email='arthur.curry@dc.com', team_id=str(team_dc._id), total_points=0),
            User.objects.create(name='Green Lantern', email='hal.jordan@dc.com', team_id=str(team_dc._id), total_points=0),
            User.objects.create(name='Cyborg', email='victor.stone@dc.com', team_id=str(team_dc._id), total_points=0),
        ]
        
        all_users = marvel_users + dc_users
        self.stdout.write(self.style.SUCCESS(f'Created {len(all_users)} superhero users'))
        
        # Create Workouts
        self.stdout.write('Creating workout routines...')
        workouts = [
            Workout.objects.create(
                name='Hero Training - Beginner',
                description='Basic superhero fitness routine for new recruits',
                activity_type='Strength Training',
                difficulty='Easy',
                duration=30,
                points=10
            ),
            Workout.objects.create(
                name='Avengers Bootcamp',
                description='Intense training session inspired by the Avengers',
                activity_type='HIIT',
                difficulty='Hard',
                duration=45,
                points=25
            ),
            Workout.objects.create(
                name='Justice League Challenge',
                description='High-intensity workout for crime fighters',
                activity_type='Circuit Training',
                difficulty='Medium',
                duration=40,
                points=20
            ),
            Workout.objects.create(
                name='Web-Slinger Cardio',
                description='Fast-paced cardio workout',
                activity_type='Cardio',
                difficulty='Medium',
                duration=35,
                points=15
            ),
            Workout.objects.create(
                name='Asgardian Power Lift',
                description='Heavy lifting routine fit for gods',
                activity_type='Strength Training',
                difficulty='Hard',
                duration=50,
                points=30
            ),
            Workout.objects.create(
                name='Speedster Sprint',
                description='Lightning-fast running workout',
                activity_type='Running',
                difficulty='Medium',
                duration=25,
                points=12
            ),
        ]
        
        self.stdout.write(self.style.SUCCESS(f'Created {len(workouts)} workout routines'))
        
        # Create Activities
        self.stdout.write('Creating activity logs...')
        activity_types = ['Running', 'Strength Training', 'Yoga', 'Cycling', 'Swimming', 'HIIT', 'Boxing']
        
        activities_created = 0
        for user in all_users:
            # Each user gets 5-10 random activities
            num_activities = random.randint(5, 10)
            for i in range(num_activities):
                duration = random.randint(20, 90)
                points = duration // 5  # 1 point per 5 minutes
                
                activity = Activity.objects.create(
                    user_id=str(user._id),
                    activity_type=random.choice(activity_types),
                    duration=duration,
                    points=points,
                    date=datetime.now() - timedelta(days=random.randint(0, 30))
                )
                
                # Update user total points
                user.total_points += points
                user.save()
                
                activities_created += 1
        
        self.stdout.write(self.style.SUCCESS(f'Created {activities_created} activity logs'))
        
        # Update team points
        self.stdout.write('Calculating team points...')
        team_marvel.total_points = sum(user.total_points for user in marvel_users)
        team_marvel.save()
        
        team_dc.total_points = sum(user.total_points for user in dc_users)
        team_dc.save()
        
        self.stdout.write(self.style.SUCCESS(f'Team Marvel: {team_marvel.total_points} points'))
        self.stdout.write(self.style.SUCCESS(f'Team DC: {team_dc.total_points} points'))
        
        # Create Leaderboard entries
        self.stdout.write('Generating leaderboard...')
        
        # User leaderboard
        sorted_users = sorted(all_users, key=lambda x: x.total_points, reverse=True)
        for rank, user in enumerate(sorted_users, start=1):
            Leaderboard.objects.create(
                entity_type='user',
                entity_id=str(user._id),
                entity_name=user.name,
                total_points=user.total_points,
                rank=rank
            )
        
        # Team leaderboard
        teams = [team_marvel, team_dc]
        sorted_teams = sorted(teams, key=lambda x: x.total_points, reverse=True)
        for rank, team in enumerate(sorted_teams, start=1):
            Leaderboard.objects.create(
                entity_type='team',
                entity_id=str(team._id),
                entity_name=team.name,
                total_points=team.total_points,
                rank=rank
            )
        
        self.stdout.write(self.style.SUCCESS('Leaderboard created!'))
        
        # Summary
        self.stdout.write(self.style.SUCCESS('\n' + '='*50))
        self.stdout.write(self.style.SUCCESS('Database population complete!'))
        self.stdout.write(self.style.SUCCESS('='*50))
        self.stdout.write(f'Teams: {Team.objects.count()}')
        self.stdout.write(f'Users: {User.objects.count()}')
        self.stdout.write(f'Activities: {Activity.objects.count()}')
        self.stdout.write(f'Workouts: {Workout.objects.count()}')
        self.stdout.write(f'Leaderboard entries: {Leaderboard.objects.count()}')
        self.stdout.write(self.style.SUCCESS('='*50))
