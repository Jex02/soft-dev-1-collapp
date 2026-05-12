import { NextRequest, NextResponse } from 'next/server';

interface College {
  id: number;
  name: string;
  location: string;
  description?: string;
  program?: string;
  status: 'Available' | 'Unavailable';
  buttonColor?: 'cyan' | 'yellow' | 'green' | 'teal';
  buttonAction?: string;
  applicationDeadline?: string;
  requirements?: string[];
  contactEmail?: string;
  createdAt: string;
  updatedAt: string;
}

const normalizeCollege = (college: College) => {
  const requirements = Array.isArray(college.requirements)
    ? college.requirements
    : typeof college.requirements === 'string'
    ? (college.requirements as string).split(',').map((item) => item.trim()).filter(Boolean)
    : [];

  return {
    ...college,
    program: college.program || college.description || '',
    requirements,
  };
};

// In-memory storage (replace with database later)
const colleges: College[] = [
  {
    id: 1,
    name: 'University of the Philippines',
    location: 'Quezon City, Philippines',
    description: 'Leading national university',
    status: 'Available',
    buttonColor: 'cyan',
    buttonAction: 'APPLY',
    applicationDeadline: '2026-06-30',
    requirements: ['High School Diploma', 'Entrance Exam', 'Interview'],
    contactEmail: 'admissions@up.edu.ph',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: 2,
    name: 'Ateneo de Manila University',
    location: 'Quezon City, Philippines',
    description: 'Private Catholic institution',
    status: 'Available',
    buttonColor: 'cyan',
    buttonAction: 'APPLY',
    applicationDeadline: '2026-05-15',
    requirements: ['High School Diploma', 'ACET Exam', 'Essay'],
    contactEmail: 'admissions@ateneo.edu',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: 3,
    name: 'De La Salle University',
    location: 'Manila, Philippines',
    description: 'Lasallian educational excellence',
    status: 'Available',
    buttonColor: 'cyan',
    buttonAction: 'APPLY',
    applicationDeadline: '2026-04-30',
    requirements: ['High School Diploma', 'DLSU College Admission Test', 'Interview'],
    contactEmail: 'admissions@dlsu.edu.ph',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
];

// GET - Retrieve all colleges or a specific college
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');
    const status = searchParams.get('status');

    if (id) {
      const college = colleges.find(c => c.id === parseInt(id));
      if (!college) {
        return NextResponse.json({ error: 'College not found' }, { status: 404 });
      }
      return NextResponse.json(normalizeCollege(college));
    }

    let filteredColleges = colleges;

    if (status) {
      filteredColleges = colleges.filter(c => c.status.toLowerCase() === status.toLowerCase());
    }

    return NextResponse.json(filteredColleges.map(normalizeCollege));
  } catch (error) {
    console.error('Error fetching colleges:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

// POST - Create a new college
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    // Validate required fields
    const { name, location, description, program } = body;
    if (!name || !location || !(description || program)) {
      return NextResponse.json(
        { error: 'Name, location, and program or description are required' },
        { status: 400 }
      );
    }

    // Check if college with same name already exists
    const existingCollege = colleges.find(c => c.name.toLowerCase() === name.toLowerCase());
    if (existingCollege) {
      return NextResponse.json(
        { error: 'College with this name already exists' },
        { status: 409 }
      );
    }

    // Generate new ID
    const newId = Math.max(...colleges.map(c => c.id), 0) + 1;

    const normalizedRequirements = Array.isArray(body.requirements)
      ? body.requirements
      : typeof body.requirements === 'string'
      ? body.requirements.split(',').map((item: string) => item.trim()).filter(Boolean)
      : [];

    const newCollege: College = {
      id: newId,
      name,
      location,
      description: body.description || body.program || '',
      program: body.program || body.description || '',
      status: body.status || 'Available',
      buttonColor: body.buttonColor || 'cyan',
      buttonAction: body.buttonAction || 'APPLY',
      applicationDeadline: body.applicationDeadline,
      requirements: normalizedRequirements,
      contactEmail: body.contactEmail,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    colleges.push(newCollege);

    return NextResponse.json(normalizeCollege(newCollege), { status: 201 });
  } catch (error) {
    console.error('Error creating college:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

// PUT - Update an existing college
export async function PUT(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json({ error: 'College ID is required' }, { status: 400 });
    }

    const collegeIndex = colleges.findIndex(c => c.id === parseInt(id));
    if (collegeIndex === -1) {
      return NextResponse.json({ error: 'College not found' }, { status: 404 });
    }

    const body = await request.json();
    const normalizedRequirements = Array.isArray(body.requirements)
      ? body.requirements
      : typeof body.requirements === 'string'
      ? body.requirements.split(',').map((item: string) => item.trim()).filter(Boolean)
      : colleges[collegeIndex].requirements;

    const updatedCollege = {
      ...colleges[collegeIndex],
      ...body,
      id: parseInt(id), // Ensure ID doesn't change
      program: body.program || body.description || colleges[collegeIndex].program || colleges[collegeIndex].description,
      description: body.description || body.program || colleges[collegeIndex].description,
      requirements: normalizedRequirements,
      updatedAt: new Date().toISOString(),
    };

    colleges[collegeIndex] = updatedCollege;

    return NextResponse.json(normalizeCollege(updatedCollege));
  } catch (error) {
    console.error('Error updating college:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

// DELETE - Delete a college
export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json({ error: 'College ID is required' }, { status: 400 });
    }

    const collegeIndex = colleges.findIndex(c => c.id === parseInt(id));
    if (collegeIndex === -1) {
      return NextResponse.json({ error: 'College not found' }, { status: 404 });
    }

    const deletedCollege = colleges.splice(collegeIndex, 1)[0];

    return NextResponse.json({
      message: 'College deleted successfully',
      deletedCollege
    });
  } catch (error) {
    console.error('Error deleting college:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}