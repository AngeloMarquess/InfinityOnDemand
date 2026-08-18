import CoursePlayer from './CoursePlayer';

export default async function CursoPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  return <CoursePlayer slug={slug} />;
}
