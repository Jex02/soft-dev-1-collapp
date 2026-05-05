import { NextRequest, NextResponse } from 'next/server';

interface Application {
  id: number;
  studentId: number;
  studentName: string;
  collegeId: number;
  collegeName: string;
  program: string;
  status: 'Pending' | 'Under Review' | 'Accepted' | 'Rejected';
  appliedDate: string;
  updatedAt: string;
  documents?: string[];
  notes?: string;
}

// In-memory storage (replace with database later)
const applications: Application[] = [
  {
    id: 1,
    studentId: 1,
    studentName: 'Juan dela Cruz',
    collegeId: 2,
    collegeName: 'Ateneo de Manila University',
    program: 'Business Administration',
    status: 'Under Review',
    appliedDate: '2026-04-15T10:00:00Z',
    updatedAt: '2026-04-15T10:00:00Z',
    documents: ['transcript.pdf', 'recommendation.pdf'],
    notes: 'Strong academic record',
  },
  {
    id: 2,
    studentId: 1,
    studentName: 'Juan dela Cruz',
    collegeId: 3,
    collegeName: 'De La Salle University',
    program: 'Industrial Engineering',
    status: 'Accepted',
    appliedDate: '2026-04-10T14:30:00Z',
    updatedAt: '2026-04-20T09:15:00Z',
    documents: ['transcript.pdf', 'portfolio.pdf'],
    notes: 'Accepted - excellent fit for program',
  },
];

// GET - Retrieve applications (all, by student, by college, or specific application)
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');
    const studentId = searchParams.get('studentId');
    const collegeId = searchParams.get('collegeId');
    const status = searchParams.get('status');

    if (id) {
      const application = applications.find(a => a.id === parseInt(id));
      if (!application) {
        return NextResponse.json({ error: 'Application not found' }, { status: 404 });
      }
      return NextResponse.json(application);
    }

    let filteredApplications = applications;

    if (studentId) {
      filteredApplications = filteredApplications.filter(a => a.studentId === parseInt(studentId));
    }

    if (collegeId) {
      filteredApplications = filteredApplications.filter(a => a.collegeId === parseInt(collegeId));
    }

    if (status) {
      filteredApplications = filteredApplications.filter(a => a.status.toLowerCase() === status.toLowerCase());
    }

    return NextResponse.json(filteredApplications);
  } catch (error) {
    console.error('Error fetching applications:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

// POST - Create a new application
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    // Validate required fields
    const { studentId, studentName, collegeId, collegeName, program } = body;
    if (!studentId || !studentName || !collegeId || !collegeName || !program) {
      return NextResponse.json(
        { error: 'Student ID, name, college ID, name, and program are required' },
        { status: 400 }
      );
    }

    // Check if student already applied to this college/program
    const existingApplication = applications.find(
      a => a.studentId === studentId && a.collegeId === collegeId && a.program === program
    );
    if (existingApplication) {
      return NextResponse.json(
        { error: 'Student has already applied to this program at this college' },
        { status: 409 }
      );
    }

    // Generate new ID
    const newId = Math.max(...applications.map(a => a.id), 0) + 1;

    const newApplication: Application = {
      id: newId,
      studentId,
      studentName,
      collegeId,
      collegeName,
      program,
      status: 'Pending',
      appliedDate: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      documents: body.documents || [],
      notes: body.notes,
    };

    applications.push(newApplication);

    return NextResponse.json(newApplication, { status: 201 });
  } catch (error) {
    console.error('Error creating application:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

// PUT - Update an application (e.g., change status, add notes)
export async function PUT(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json({ error: 'Application ID is required' }, { status: 400 });
    }

    const applicationIndex = applications.findIndex(a => a.id === parseInt(id));
    if (applicationIndex === -1) {
      return NextResponse.json({ error: 'Application not found' }, { status: 404 });
    }

    const body = await request.json();
    const updatedApplication = {
      ...applications[applicationIndex],
      ...body,
      id: parseInt(id), // Ensure ID doesn't change
      updatedAt: new Date().toISOString(),
    };

    applications[applicationIndex] = updatedApplication;

    return NextResponse.json(updatedApplication);
  } catch (error) {
    console.error('Error updating application:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

// DELETE - Delete an application
export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json({ error: 'Application ID is required' }, { status: 400 });
    }

    const applicationIndex = applications.findIndex(a => a.id === parseInt(id));
    if (applicationIndex === -1) {
      return NextResponse.json({ error: 'Application not found' }, { status: 404 });
    }

    const deletedApplication = applications.splice(applicationIndex, 1)[0];

    return NextResponse.json({
      message: 'Application deleted successfully',
      deletedApplication
    });
  } catch (error) {
    console.error('Error deleting application:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}