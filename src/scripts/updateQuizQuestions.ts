import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://zytgblsewpfwraykljcf.supabase.co';
const supabaseServiceKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inp5dGdibHNld3Bmd3JheWtsamNmIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTczODY3ODIwMCwiZXhwIjoyMDU0MjU0MjAwfQ.s-2koSKPno-JJyMgjk_WINU5D91SPWLm8V2nge0Syps';

const supabase = createClient(supabaseUrl, supabaseServiceKey);

const questions = [
  {
    question: "What does a circular white sign with a red border indicate?",
    options: ["Warning", "Information", "Prohibition", "Guidance"],
    correct_answer: "Prohibition",
    category: "Regulatory Signs"
  },
  {
    question: "A red circle with a diagonal line through a symbol means:",
    options: ["Caution required", "Prohibition of whatever is shown", "End of restriction", "Mandatory action"],
    correct_answer: "Prohibition of whatever is shown",
    category: "Regulatory Signs"
  },
  {
    question: "What is the meaning of a blue rectangular sign with white symbols?",
    options: ["Tourist information", "Warning", "Positive instruction or information", "Temporary condition"],
    correct_answer: "Positive instruction or information",
    category: "Regulatory Signs"
  },
  {
    question: "When you see a stop sign, where must you stop?",
    options: ["Anywhere near the sign", "In line with the sign or stop line", "After the intersection", "Before the sign"],
    correct_answer: "In line with the sign or stop line",
    category: "Regulatory Signs"
  },
  {
    question: "What does a white circular sign with a red border and \"60\" mean?",
    options: ["Minimum speed limit", "Maximum speed limit", "Recommended speed", "Distance to destination"],
    correct_answer: "Maximum speed limit",
    category: "Regulatory Signs"
  },
  {
    question: "A regulatory sign showing \"R\" means:",
    options: ["Road works ahead", "Rest stop ahead", "Roadway reservation", "Route marker"],
    correct_answer: "Roadway reservation",
    category: "Regulatory Signs"
  },
  {
    question: "What does a blue rectangular sign with \"P\" indicate?",
    options: ["Police station ahead", "Parking area", "Pedestrian crossing", "Public transport stop"],
    correct_answer: "Parking area",
    category: "Regulatory Signs"
  },
  {
    question: "A sign showing a red circle with a motorcycle symbol means:",
    options: ["Motorcycles only", "No motorcycles allowed", "Motorcycle parking", "Motorcycle crossing"],
    correct_answer: "No motorcycles allowed",
    category: "Regulatory Signs"
  },
  {
    question: "What shape are standard warning signs?",
    options: ["Circular", "Rectangular", "Triangular with red border", "Octagonal"],
    correct_answer: "Triangular with red border",
    category: "Warning Signs"
  },
  {
    question: "A triangular sign showing wavy lines means:",
    options: ["River ahead", "Slippery road", "Speed bumps", "Railway crossing"],
    correct_answer: "Slippery road",
    category: "Warning Signs"
  },
  {
    question: "What does a warning sign with an aircraft symbol indicate?",
    options: ["No flying allowed", "Aircraft noise", "Low flying aircraft", "Airport ahead"],
    correct_answer: "Airport ahead",
    category: "Warning Signs"
  },
  {
    question: "A warning sign showing children means:",
    options: ["School zone ahead", "Playground nearby", "Children likely to be present", "All of the above"],
    correct_answer: "Children likely to be present",
    category: "Warning Signs"
  },
  {
    question: "What does a warning sign with a truck pointing downward indicate?",
    options: ["Truck stop ahead", "Steep descent", "Loading zone", "No trucks allowed"],
    correct_answer: "Steep descent",
    category: "Warning Signs"
  },
  {
    question: "A warning sign showing \"!\" means:",
    options: ["Other dangers", "High priority road", "Emergency only", "Information point"],
    correct_answer: "Other dangers",
    category: "Warning Signs"
  },
  {
    question: "What color combination is used for general information signs?",
    options: ["Red and white", "Black and yellow", "Blue and white", "Green and white"],
    correct_answer: "Blue and white",
    category: "Information Signs"
  },
  {
    question: "What does an information sign with \"H\" indicate?",
    options: ["Helicopter pad", "Hospital", "Highway", "Hotel"],
    correct_answer: "Hospital",
    category: "Information Signs"
  },
  {
    question: "An information sign showing \"P&R\" means:",
    options: ["Parking and restrooms", "Park and ride facility", "Parking and repairs", "Police and rangers"],
    correct_answer: "Park and ride facility",
    category: "Information Signs"
  },
  {
    question: "What color are direction signs for freeways?",
    options: ["Blue", "Green", "Brown", "White"],
    correct_answer: "Green",
    category: "Guidance Signs"
  },
  {
    question: "Tourist destination signs are typically what color?",
    options: ["Green", "Blue", "Brown", "White"],
    correct_answer: "Brown",
    category: "Guidance Signs"
  },
  {
    question: "What does a white-on-brown sign with a camera symbol indicate?",
    options: ["Speed camera", "Viewpoint", "Tourist photographs", "Security cameras"],
    correct_answer: "Viewpoint",
    category: "Guidance Signs"
  },
  {
    question: "What does a solid white line in the center of the road mean?",
    options: ["Overtaking permitted", "No overtaking allowed", "Lane division only", "Construction ahead"],
    correct_answer: "No overtaking allowed",
    category: "Road Surface Markings"
  },
  {
    question: "Yellow lines on the side of the road indicate:",
    options: ["No stopping at any time", "No parking", "Loading zone", "Pedestrian area"],
    correct_answer: "No parking",
    category: "Road Surface Markings"
  },
  {
    question: "What does a painted island (blocked area) on the road mean?",
    options: ["Parking area", "No driving allowed on this area", "Loading zone", "Construction area"],
    correct_answer: "No driving allowed on this area",
    category: "Road Surface Markings"
  },
  {
    question: "What do zigzag lines near a pedestrian crossing mean?",
    options: ["No parking", "No stopping", "Speed bumps ahead", "School zone"],
    correct_answer: "No stopping",
    category: "Road Surface Markings"
  },
  {
    question: "A painted box with diagonal lines at an intersection means:",
    options: ["Parking allowed", "No entry", "Don't stop in the box if exit isn't clear", "Pedestrian crossing"],
    correct_answer: "Don't stop in the box if exit isn't clear",
    category: "Road Surface Markings"
  },
  {
    question: "When traffic lights are out of order, what should you treat the intersection as?",
    options: ["Yield sign", "4-way stop", "Right of way to the right", "Proceed with caution"],
    correct_answer: "4-way stop",
    category: "Traffic Signals"
  },
  {
    question: "A flashing green arrow in traffic lights means:",
    options: ["Proceed with caution", "Stop and yield", "Protected turn in arrow direction", "Yield to oncoming traffic"],
    correct_answer: "Protected turn in arrow direction",
    category: "Traffic Signals"
  },
  {
    question: "What does a steady red man signal at a pedestrian crossing mean?",
    options: ["Pedestrians may cross with caution", "Pedestrians must not cross", "Pedestrians must run across", "Crossing will close soon"],
    correct_answer: "Pedestrians must not cross",
    category: "Traffic Signals"
  },
  {
    question: "What color are temporary road signs?",
    options: ["Red and white", "Blue and white", "Yellow and black", "Green and white"],
    correct_answer: "Yellow and black",
    category: "Temporary Signs"
  },
  {
    question: "A temporary sign showing \"STOP/GO\" means:",
    options: ["Choose whether to stop or go", "Stop, then proceed slowly", "Wait for manual operator instructions", "Temporary traffic light ahead"],
    correct_answer: "Wait for manual operator instructions",
    category: "Temporary Signs"
  },
  {
    question: "What does a speed limit sign with \"km/h\" and a \"TRUCKS\" sub-plate mean?",
    options: ["Speed limit for all vehicles", "Speed limit applies only to trucks", "Minimum speed for trucks", "Truck route ahead"],
    correct_answer: "Speed limit applies only to trucks",
    category: "Combination Signs"
  },
  {
    question: "A prohibition sign with \"07:00-09:00\" beneath it means:",
    options: ["Prohibition applies all day", "Prohibition applies only during those hours", "Road closed during those hours", "Peak traffic hours"],
    correct_answer: "Prohibition applies only during those hours",
    category: "Combination Signs"
  },
  {
    question: "What does a white \"B\" on a blue background indicate?",
    options: ["Bus stop", "Bus lane only", "Bridge ahead", "Breakdown area"],
    correct_answer: "Bus lane only",
    category: "Transport Signs"
  },
  {
    question: "A sign showing a bus with a red line through it means:",
    options: ["Bus stop", "No buses allowed", "Bus lane ends", "Bus terminal ahead"],
    correct_answer: "No buses allowed",
    category: "Transport Signs"
  },
  {
    question: "What color is an emergency services sign?",
    options: ["Green and white", "Red and white", "Blue and white", "Yellow and black"],
    correct_answer: "Red and white",
    category: "Emergency Signs"
  }
];

async function updateQuizQuestions() {
  try {
    // First, let's clear existing questions
    const { error: deleteError } = await supabase
      .from('quiz_questions')
      .delete()
      .neq('id', 0); // This will delete all existing questions

    if (deleteError) {
      console.error('Error deleting existing questions:', deleteError);
      return;
    }

    // Now insert the new questions
    const { data, error } = await supabase
      .from('quiz_questions')
      .insert(questions.map(q => ({
        question: q.question,
        options: q.options,
        correct_answer: q.correct_answer,
        category: q.category
      })));

    if (error) {
      console.error('Error inserting questions:', error);
      return;
    }

    console.log('Successfully updated quiz questions!');
    console.log(`Inserted ${data?.length} questions`);

  } catch (error) {
    console.error('Error updating questions:', error);
  }
}

// Run the update
updateQuizQuestions(); 