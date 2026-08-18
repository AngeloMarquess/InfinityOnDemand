import { NextRequest, NextResponse } from 'next/server';
import { getServerSupabase } from '@/lib/supabase';

// Helper for safe responses
export async function GET(request: NextRequest) {
  try {
    const supabase = getServerSupabase();

    // 1. Fetch Courses (all, including unpublished)
    const { data: courses, error: coursesErr } = await supabase
      .from('academy_courses')
      .select('*')
      .order('order_index', { ascending: true });

    // 2. Fetch Modules & Lessons
    const { data: modules } = await supabase
      .from('academy_modules')
      .select('*')
      .order('order_index', { ascending: true });

    const { data: lessons } = await supabase
      .from('academy_lessons')
      .select('*')
      .order('order_index', { ascending: true });

    // 3. Fetch Students & Profiles
    const { data: profiles } = await supabase
      .from('academy_profiles')
      .select('*')
      .order('created_at', { ascending: false });

    // 4. Fetch Gamification data
    const { data: gamification } = await supabase
      .from('academy_gamification')
      .select('*');

    // 5. Fetch Enrollments & Progress
    const { data: enrollments } = await supabase
      .from('academy_enrollments')
      .select('*');

    const { data: progress } = await supabase
      .from('academy_lesson_progress')
      .select('*');

    // 6. Fetch Companies (B2B)
    const { data: companies } = await supabase
      .from('academy_companies')
      .select('*')
      .order('created_at', { ascending: false });

    // 7. Fetch Achievements
    const { data: achievements } = await supabase
      .from('academy_achievements')
      .select('*')
      .order('tier', { ascending: true });

    return NextResponse.json({
      success: true,
      courses: courses || [],
      modules: modules || [],
      lessons: lessons || [],
      profiles: profiles || [],
      gamification: gamification || [],
      enrollments: enrollments || [],
      progress: progress || [],
      companies: companies || [],
      achievements: achievements || [],
    });
  } catch (error) {
    console.error('Academy Admin GET error:', error);
    // Return fallback sample data if database table is empty or unconfigured
    return NextResponse.json({
      success: true,
      courses: [],
      modules: [],
      lessons: [],
      profiles: [],
      gamification: [],
      enrollments: [],
      progress: [],
      companies: [],
      achievements: [],
      isFallback: true,
    });
  }
}

export async function POST(request: NextRequest) {
  try {
    const supabase = getServerSupabase();
    const body = await request.json();
    const { action, payload } = body;

    if (!action) {
      return NextResponse.json({ error: 'Ação não especificada.' }, { status: 400 });
    }

    // ------------------------------------------------------------- SAVE COURSE
    if (action === 'save_course') {
      const { id, ...courseData } = payload;
      if (id) {
        const { data, error } = await supabase
          .from('academy_courses')
          .update(courseData)
          .eq('id', id)
          .select()
          .single();
        if (error) throw error;
        return NextResponse.json({ success: true, course: data });
      } else {
        const { data, error } = await supabase
          .from('academy_courses')
          .insert(courseData)
          .select()
          .single();
        if (error) throw error;
        return NextResponse.json({ success: true, course: data });
      }
    }

    // ----------------------------------------------------------- DELETE COURSE
    if (action === 'delete_course') {
      const { id } = payload;
      const { error } = await supabase.from('academy_courses').delete().eq('id', id);
      if (error) throw error;
      return NextResponse.json({ success: true });
    }

    // ------------------------------------------------------------- SAVE MODULE
    if (action === 'save_module') {
      const { id, ...modData } = payload;
      if (id) {
        const { data, error } = await supabase
          .from('academy_modules')
          .update(modData)
          .eq('id', id)
          .select()
          .single();
        if (error) throw error;
        return NextResponse.json({ success: true, module: data });
      } else {
        const { data, error } = await supabase
          .from('academy_modules')
          .insert(modData)
          .select()
          .single();
        if (error) throw error;
        return NextResponse.json({ success: true, module: data });
      }
    }

    // ----------------------------------------------------------- DELETE MODULE
    if (action === 'delete_module') {
      const { id } = payload;
      const { error } = await supabase.from('academy_modules').delete().eq('id', id);
      if (error) throw error;
      return NextResponse.json({ success: true });
    }

    // ------------------------------------------------------------- SAVE LESSON
    if (action === 'save_lesson') {
      const { id, ...lessonData } = payload;
      if (id) {
        const { data, error } = await supabase
          .from('academy_lessons')
          .update(lessonData)
          .eq('id', id)
          .select()
          .single();
        if (error) throw error;
        return NextResponse.json({ success: true, lesson: data });
      } else {
        const { data, error } = await supabase
          .from('academy_lessons')
          .insert(lessonData)
          .select()
          .single();
        if (error) throw error;
        return NextResponse.json({ success: true, lesson: data });
      }
    }

    // ----------------------------------------------------------- DELETE LESSON
    if (action === 'delete_lesson') {
      const { id } = payload;
      const { error } = await supabase.from('academy_lessons').delete().eq('id', id);
      if (error) throw error;
      return NextResponse.json({ success: true });
    }

    // ---------------------------------------------------------- ENROLL STUDENT
    if (action === 'enroll_student') {
      const { user_id, course_id } = payload;
      const { data, error } = await supabase
        .from('academy_enrollments')
        .upsert({ user_id, course_id, progress_pct: 0 })
        .select()
        .single();
      if (error) throw error;
      return NextResponse.json({ success: true, enrollment: data });
    }

    // ------------------------------------------------------------ SAVE COMPANY
    if (action === 'save_company') {
      const { id, ...compData } = payload;
      if (id) {
        const { data, error } = await supabase
          .from('academy_companies')
          .update(compData)
          .eq('id', id)
          .select()
          .single();
        if (error) throw error;
        return NextResponse.json({ success: true, company: data });
      } else {
        const { data, error } = await supabase
          .from('academy_companies')
          .insert(compData)
          .select()
          .single();
        if (error) throw error;
        return NextResponse.json({ success: true, company: data });
      }
    }

    return NextResponse.json({ error: 'Ação desconhecida.' }, { status: 400 });
  } catch (error) {
    console.error('Academy Admin POST error:', error);
    return NextResponse.json({ error: error instanceof Error ? error.message : 'Erro ao processar requisição.' }, { status: 500 });
  }
}
