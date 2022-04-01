import Layout from '@/components/Layout';
import Image from 'next/image';
import { useRouter } from 'next/router';

const apiPath = 'https://react.webworker.berlin/wp-json/wp/v2/';

/* Wenn man einen dynamischen Pfad hat, muss man Next mitteilen,
welche Pfade das System statisch generieren soll, hier also
eine Liste der vorhanden Blog-Slugs übergeben.
https://nextjs.org/docs/basic-features/data-fetching/get-static-paths
*/
export async function getStaticPaths() {
  let paths = [];

  try {
	const response = await fetch(`${apiPath}posts`);

	if (!response.ok) {
  	throw new Error('Problem!');
	}

	const posts = await response.json();

	/*
	Der Schlüsselname "params" ist vorgegeben. Der Schlüsselname
	"slug" entspricht dem Platzhalter [slug] im Dateinamen von [slug].jsx
	Die Einträge im paths-Array werden an getStaticProps übergeben,
	so dass für jeden Eintrag eine Seite generiert werden kann.
	https://nextjs.org/docs/api-reference/data-fetching/get-static-paths
	*/
	paths = posts.map(({ slug }) => ({ params: { slug } }));
  } catch (e) {
	console.log(e);
  }

  /* fallback legt fest, dass ein neuer und noch nicht in paths
  enthaltene Slug frisch von WordPress geholt werden soll.
  Wenn man für paths einen leeren Array zurückgibt, werden
  also alle Blogbeiträge erst statisch generiert, wenn sie
  zum ersten Mal angefordert werden. Man könnte in paths
  auch nur z.B. die 20 neuesten Blogbeiträge übergeben. */
  return { paths, fallback: true };
}

export async function getStaticProps({ params }) {
  let post = {};

  try {
	const response = await fetch(`${apiPath}posts?slug=${params.slug}`);
	if (!response.ok) {
  	throw new Error('Problem!');
	}

	const posts = await response.json();

	post = posts[0];

	if (post.featured_media) {
  	post.titleImage = await getTitleImage(post.featured_media);
	}
  } catch (error) {
	console.log(error);
  }

  return {
	props: {
  	post,
	},
	revalidate: 3600, // Einmal pro Stunde aktualisieren
  };
}

async function getTitleImage(imageId) {
  try {
	const response = await fetch(`${apiPath}media/${imageId}`);
	const imageData = await response.json();

	return {
  	src: imageData.guid.rendered,
  	width: imageData.media_details.width,
  	height: imageData.media_details.height,
  	alt: imageData.alt_text,
	};
  } catch (error) {
	console.log(error);
	return null;
  }
}

export default function BlogPost({ post }) {
  // https://nextjs.org/docs/basic-features/data-fetching#fallback-pages
  const router = useRouter();

  if (router.isFallback) {
	return (
  	<Layout>
    	<strong>Laden…</strong>
  	</Layout>
	);
  }

  const { title, content, titleImage } = post;

  return (
	<Layout title={title.rendered}>
  	{/*
  	1. Prüfen, ob ein Bild vorhanden ist.
  	2. Wenn ja, Bilddaten nutzen, um ein Image-Element (Next Image-Komponente)
  	darzustellen.
  	*/}
  	{titleImage && (
    	<Image
      	{...titleImage}
      	layout="responsive"
      	sizes="(max-width: 50rem) 90vw, 48rem"
    	/>
  	)}

  	<div dangerouslySetInnerHTML={{ __html: content.rendered }} />
	</Layout>
  );
}


