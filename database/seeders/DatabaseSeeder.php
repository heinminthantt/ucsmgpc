<?php

namespace Database\Seeders;

use App\Models\User;
use App\Models\Department;
use App\Models\Course;
use App\Models\Project;
use App\Models\Tag;
use App\Models\Member;
use App\Models\Comment;
use App\Models\Reaction;
use App\Models\SavedProject;
use App\Models\ProjectFile;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Str;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        // 1. Seed Users (Admin, Supervisors, Students)
        $admin = User::create([
            'name' => 'System Administrator',
            'email' => 'admin@example.com',
            'password' => Hash::make('password'),
            'role' => 'ADMIN',
            'is_active' => true,
        ]);

        $supervisors = [
            User::create([
                'name' => 'Dr. Charles Xavier',
                'email' => 'charles@example.com',
                'password' => Hash::make('password'),
                'role' => 'SUPERVISOR',
                'is_active' => true,
                'bio' => 'Professor of Computer Science with a focus on Human-Computer Interaction and Neural Networks.',
            ]),
            User::create([
                'name' => 'Dr. Reed Richards',
                'email' => 'reed@example.com',
                'password' => Hash::make('password'),
                'role' => 'SUPERVISOR',
                'is_active' => true,
                'bio' => 'Dean of Engineering, specializing in Embedded Systems and Distributed Computing architectures.',
            ]),
            User::create([
                'name' => 'Dr. Bruce Banner',
                'email' => 'bruce@example.com',
                'password' => Hash::make('password'),
                'role' => 'SUPERVISOR',
                'is_active' => true,
                'bio' => 'Senior Lecturer in Information Systems, researching High-Performance Computing and Data Analytics.',
            ]),
        ];

        $students = [
            User::create([
                'name' => 'Peter Parker',
                'email' => 'peter@example.com',
                'password' => Hash::make('password'),
                'role' => 'USER',
                'is_active' => true,
                'bio' => 'CS student passionate about computer vision and dynamic web applications.',
            ]),
            User::create([
                'name' => 'Gwen Stacy',
                'email' => 'gwen@example.com',
                'password' => Hash::make('password'),
                'role' => 'USER',
                'is_active' => true,
            ]),
            User::create([
                'name' => 'Tony Stark',
                'email' => 'tony@example.com',
                'password' => Hash::make('password'),
                'role' => 'USER',
                'is_active' => true,
            ]),
            User::create([
                'name' => 'Bruce Wayne',
                'email' => 'brucew@example.com',
                'password' => Hash::make('password'),
                'role' => 'USER',
                'is_active' => true,
            ]),
            User::create([
                'name' => 'Clark Kent',
                'email' => 'clark@example.com',
                'password' => Hash::make('password'),
                'role' => 'USER',
                'is_active' => true,
            ]),
            User::create([
                'name' => 'Diana Prince',
                'email' => 'diana@example.com',
                'password' => Hash::make('password'),
                'role' => 'USER',
                'is_active' => true,
            ]),
        ];

        // 2. Seed Departments & Courses
        $depts = [
            'CS' => Department::create(['name' => 'Computer Science']),
            'CT' => Department::create(['name' => 'Computer Technology']),
            'IS' => Department::create(['name' => 'Information Science']),
            'SE' => Department::create(['name' => 'Software Engineering']),
        ];

        $courses = [
            'CS' => [
                'web' => Course::create(['department_id' => $depts['CS']->id, 'name' => 'Web Development', 'code' => 'CS-321']),
                'ai'  => Course::create(['department_id' => $depts['CS']->id, 'name' => 'Artificial Intelligence', 'code' => 'CS-322']),
            ],
            'CT' => [
                'embedded' => Course::create(['department_id' => $depts['CT']->id, 'name' => 'Embedded Systems', 'code' => 'CT-421']),
                'robotics' => Course::create(['department_id' => $depts['CT']->id, 'name' => 'Robotics & Control', 'code' => 'CT-422']),
            ],
            'IS' => [
                'security' => Course::create(['department_id' => $depts['IS']->id, 'name' => 'CS-323 — Information Security', 'code' => 'CS-323']),
            ],
            'SE' => [
                'patterns' => Course::create(['department_id' => $depts['SE']->id, 'name' => 'Software Design Patterns', 'code' => 'Final-SE']),
            ],
        ];

        // 3. Seed Tags
        $tagsData = [
            'Laravel', 'React', 'TypeScript', 'Python', 'TailwindCSS',
            'Next.js', 'PyTorch', 'C++', 'Arduino', 'PostgreSQL',
            'CyberSecurity', 'Docker', 'Embedded Systems', 'Node.js',
        ];
        $tags = [];
        foreach ($tagsData as $tName) {
            $tags[] = Tag::create(['name' => $tName]);
        }

        // 4. Dummy Projects data
        $projectTemplates = [
            [
                'title' => 'Smart Attendance System using Face Recognition',
                'description' => 'An automated attendance marker that uses OpenCV and Deep Learning to identify student faces as they enter the classroom, logging their attendance in real-time.',
                'benefits' => 'Reduces administrative overhead, eliminates proxy attendance, and provides immediate presence notifications to supervisors.',
                'body' => '<p>This project uses a custom Convolutional Neural Network (CNN) trained on facial image data. It interfaces with an IP camera to detect, align, and recognize student faces. Features include real-time dashboards for supervisors and daily CSV reports.</p>',
                'cover_image_url' => 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=800&auto=format&fit=crop&q=60',
                'academic_year' => '2024-2025',
                'student_year' => 'Semester VI',
                'github_link' => 'https://github.com/peterparker/smart-attendance',
                'dept' => 'CS',
                'course_key' => 'ai',
                'student_index' => 0, // Peter Parker
                'supervisor_index' => 0, // Charles Xavier
                'status' => 'approved',
                'is_featured' => true,
            ],
            [
                'title' => 'Decentralized Voting Platform on Ethereum',
                'description' => 'A blockchain-based secure voting platform ensuring absolute data transparency, auditability, and preventing double voting or fraudulent manipulation.',
                'benefits' => 'Guarantees tamper-proof elections, high accessibility for remote voters, and immediate crytographic tally verification.',
                'body' => '<p>Built with Solidity smart contracts deployed on an Ethereum local testnet, using React and Web3.js for the user interface. Features voter authentication via cryptographic wallets and end-to-end encryption of ballot options.</p>',
                'cover_image_url' => 'https://images.unsplash.com/photo-1639762681485-074b7f938ba0?w=800&auto=format&fit=crop&q=60',
                'academic_year' => '2023-2024',
                'student_year' => 'Final Project',
                'github_link' => 'https://github.com/gwenstacy/ethereum-voting',
                'dept' => 'SE',
                'course_key' => 'patterns',
                'student_index' => 1, // Gwen Stacy
                'supervisor_index' => 1, // Reed Richards
                'status' => 'approved',
                'is_featured' => true,
            ],
            [
                'title' => 'IOT Embedded Home Automation Hub',
                'description' => 'An Arduino and Raspberry Pi based automation gateway that coordinates smart household appliances, environmental sensors, and energy meters.',
                'benefits' => 'Low-cost self-hosted alternative to proprietary platforms, energy efficiency insights, and customizable automation scripts.',
                'body' => '<p>Utilizes MQTT protocol for low-latency communication. An Express/Node.js server runs on the Raspberry Pi acting as the orchestrator. Users control locks, lights, and thermostats via a responsive Next.js frontend.</p>',
                'cover_image_url' => 'https://images.unsplash.com/photo-1558346490-a72e53ae2d4f?w=800&auto=format&fit=crop&q=60',
                'academic_year' => '2024-2025',
                'student_year' => 'Semester VIII',
                'github_link' => 'https://github.com/tonystark/jarvis-home',
                'dept' => 'CT',
                'course_key' => 'embedded',
                'student_index' => 2, // Tony Stark
                'supervisor_index' => 1, // Reed Richards
                'status' => 'approved',
                'is_featured' => false,
            ],
            [
                'title' => 'Intrusion Detection System via Network Packet Analysis',
                'description' => 'A lightweight cyber security tool that monitors live network card packets, detecting anomaly patterns and known exploit signatures.',
                'benefits' => 'Protects organization internal networks from active attacks, provides detailed packet capture logs, and fires alerts.',
                'body' => '<p>Written in Python using Scapy for real-time packet parsing. Matches header properties against Snort signatures and uses a local SQLite database for incident storage. Features a modern dashboard built with Tailwind and Laravel.</p>',
                'cover_image_url' => 'https://images.unsplash.com/photo-1550751827-4bd374c3f58b?w=800&auto=format&fit=crop&q=60',
                'academic_year' => '2024-2025',
                'student_year' => 'Semester VI',
                'github_link' => 'https://github.com/brucewayne/bat-ids',
                'dept' => 'IS',
                'course_key' => 'security',
                'student_index' => 3, // Bruce Wayne
                'supervisor_index' => 2, // Bruce Banner
                'status' => 'approved',
                'is_featured' => false,
            ],
            [
                'title' => 'Autonomous Warehouse Sorting Robot',
                'description' => 'A small-scale physical robot prototype that navigates warehouse gridlines, scans barcodes on packages, and deposits them at designated drop zones.',
                'benefits' => 'Implements automated warehouse sorting logic, reducing physical labor and logistics error margins.',
                'body' => '<p>Features line-following sensors, a camera module for barcode reading, and dual DC motors. Code written in C++ running on an ESP32 microcontroller, communicating sorting status back to a central server via HTTP APIs.</p>',
                'cover_image_url' => 'https://images.unsplash.com/photo-1485827404703-89b55fcc595e?w=800&auto=format&fit=crop&q=60',
                'academic_year' => '2024-2025',
                'student_year' => 'Semester VIII',
                'github_link' => 'https://github.com/tonystark/warehouse-bot',
                'dept' => 'CT',
                'course_key' => 'robotics',
                'student_index' => 2, // Tony Stark
                'supervisor_index' => 1, // Reed Richards
                'status' => 'pending',
                'is_featured' => false,
            ],
            [
                'title' => 'UCSMGY Student Social & Collab Platform',
                'description' => 'A social platform where students can find teammates, share notes, post projects, and create study groups within departments.',
                'benefits' => 'Enhances student collaboration across batches and builds a community-focused learning environment.',
                'body' => '<p>Built fully on Laravel and Inertia.js with React. Provides direct messaging, notification feeds, post creations with rich text editing, and calendar scheduling for study sessions.</p>',
                'cover_image_url' => 'https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=800&auto=format&fit=crop&q=60',
                'academic_year' => '2024-2025',
                'student_year' => 'Semester VI',
                'github_link' => 'https://github.com/clarkkent/ucsmgy-collab',
                'dept' => 'CS',
                'course_key' => 'web',
                'student_index' => 4, // Clark Kent
                'supervisor_index' => 0, // Charles Xavier
                'status' => 'pending',
                'is_featured' => false,
            ]
        ];

        foreach ($projectTemplates as $pTemp) {
            $submittedBy = $students[$pTemp['student_index']];
            $supervisor = $supervisors[$pTemp['supervisor_index']];
            $dept = $depts[$pTemp['dept']];
            $course = $courses[$pTemp['dept']][$pTemp['course_key']];

            // Create Project
            $project = Project::create([
                'title' => $pTemp['title'],
                'description' => $pTemp['description'],
                'benefits' => $pTemp['benefits'],
                'body' => $pTemp['body'],
                'content_format' => 'html',
                'cover_image_url' => $pTemp['cover_image_url'],
                'academic_year' => $pTemp['academic_year'],
                'student_year' => $pTemp['student_year'],
                'github_link' => $pTemp['github_link'],
                'user_id' => $submittedBy->id,
                'department_id' => $dept->id,
                'course_id' => $course->id,
                'supervisor_id' => $supervisor->id,
                'approval_status' => $pTemp['status'],
                'approved_at' => $pTemp['status'] === 'approved' ? now() : null,
                'approved_by' => $pTemp['status'] === 'approved' ? $supervisor->id : null,
                'members_json' => json_encode([
                    ['name' => $submittedBy->name, 'rollNumber' => 'UCS-0' . rand(1, 9)],
                    ['name' => $students[rand(0, 5)]->name, 'rollNumber' => 'UCS-0' . rand(1, 9)]
                ]),
            ]);

            // 5. Seed Project Tags (Pivot)
            $projectTags = collect($tags)->random(rand(2, 4));
            $project->tags()->attach($projectTags->pluck('id'));

            // 6. Seed Project Members (Pivot)
            $mem1 = Member::create([
                'name' => $submittedBy->name,
                'roll_number' => 'UCS-0' . rand(1, 9),
            ]);
            $mem2 = Member::create([
                'name' => $students[rand(0, 5)]->name,
                'roll_number' => 'UCS-0' . rand(1, 9),
            ]);
            $project->members()->attach([$mem1->id, $mem2->id]);

            // 7. Seed Project Files
            ProjectFile::create([
                'project_id' => $project->id,
                'file_path' => 'projects/files/dummy_report.pdf',
                'original_name' => 'final_project_report.pdf',
            ]);
            ProjectFile::create([
                'project_id' => $project->id,
                'file_path' => 'projects/files/dummy_src.zip',
                'original_name' => 'source_code.zip',
            ]);

            // 8. Seed Reactions & Comments
            if ($project->approval_status === 'approved') {
                foreach ($students as $stu) {
                    if (rand(0, 1)) {
                        Reaction::create([
                            'project_id' => $project->id,
                            'user_id' => $stu->id,
                        ]);
                    }

                    if (rand(0, 3) === 0) {
                        Comment::create([
                            'project_id' => $project->id,
                            'user_id' => $stu->id,
                            'comment' => collect([
                                'This is an amazing project! I really like the approach.',
                                'Great documentation. The code looks really clean.',
                                'Did you face any issues with latency in production?',
                                'Impressive work. Looking forward to see it deployed.',
                                'Is this built using Laravel or React? Good job!',
                            ])->random(),
                        ]);
                    }
                }

                // Seed some saved projects
                foreach (collect($students)->random(rand(1, 3)) as $stu) {
                    SavedProject::create([
                        'user_id' => $stu->id,
                        'project_id' => $project->id,
                    ]);
                }
            }
        }
    }
}
