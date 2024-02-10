import { useEffect, useState } from 'react'

import { MetaTags, useServerInsertedHTML } from '@redwoodjs/web'

import BlogPostCell from 'src/components/BlogPostCell'

type BlogPostPageProps = {
  id: number
}

// export const meta = async () => {
//   const img = await Node.sharp.render()
//   const ogUrl = await s3.putObject({
//     img,
//   }

//   return {
//     title: 'My Blog Post',
//     'og:image': ogUrl,
//   }
// }

const BlogPostPage = ({ id }: BlogPostPageProps) => {
  useServerInsertedHTML(() => {
    console.log('Running from BlogPostPage')

    return <meta name="bazinga" content="FIND ME AFTER INJECTION" />
  })

  // useEffect(() => {
  //   console.log('Running from BlogPostPage useEffect')
  //   const handler = (e) => {
  //     console.log('xxxxxxxxx fired from useffect', document.readyState)
  //   }
  //   document.addEventListener('readystatechange', handler)

  //   return () => {
  //     document.removeEventListener('readystatechange', handler)
  //   }
  // }, [])

  const [renderH, setRenderH] = useState(false)

  return (
    <>
      {/* <MetaTags title={`Post ${id}`} description={`Description ${id}`} /> */}

      <BlogPostCell id={id} />

      <button
        onClick={() => {
          setRenderH(true)
        }}
      >
        Click me to render meta tags now
      </button>

      {renderH && (
        <MetaTags
          title={`This is rendered on click`}
          description={`Bbazinggggaaaa`}
        />
      )}
    </>
  )
}

export default BlogPostPage
