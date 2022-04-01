import Layout from '@/components/Layout';
import ShuffleText from '@/components/ShuffleText';

export default function Home() {
  return (
    <Layout title="Willkommen zu NextJS!">
      <p>Meine erste Next-App</p>
      <ShuffleText />
    </Layout>
  );
}
