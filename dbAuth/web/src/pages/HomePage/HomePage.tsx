import { setVerbosity } from 'ts-invariant'

import { useAuth } from 'src/auth'
import BlogPostsCell from 'src/components/BlogPostsCell'
import DelayedStuff from 'src/components/DelayedComponent'

// const doSomething = () => {
//   console.log(PrismaClient)
// }
setVerbosity('debug')

const HomePage = () => {
  const { currentUser } = useAuth()
  console.log(`👉 \n ~ file: HomePage.tsx:14 ~ currentUser:`, currentUser)

  return (
    <>
      <BlogPostsCell />
    </>
  )
}

export default HomePage
