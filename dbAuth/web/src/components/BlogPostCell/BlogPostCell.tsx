import type {
  FindBlogPostQuery,
  FindBlogPostQueryVariables,
} from 'types/graphql'

import type { CellSuccessProps, CellFailureProps } from '@redwoodjs/web'

import BlogPost from 'src/components/BlogPost'

export const QUERY = gql`
  query FindBlogPostQuery($id: Int!) {
    blogPost: post(id: $id) {
      id
      title
      body
      author {
        email
        fullName
      }
      createdAt
    }
  }
`

export const Loading = () => {
  return (
    <div className="mt-4">
      <div className="flex animate-pulse">
        <div className="h-4 w-1/5 rounded-full bg-gray-400"></div>
      </div>
      <div className="mt-5 animate-pulse">
        <div className="h-4 w-4/5 rounded-full bg-gray-400"></div>
        <div className="mt-2 h-4 w-3/4 rounded-full bg-gray-400"></div>
        <div className="mt-2 h-4 w-1/2 rounded-full bg-gray-400"></div>
        <div className="mt-2 h-4 w-full rounded-full bg-gray-400"></div>
      </div>
    </div>
  )
}

export const Empty = () => <div>Empty</div>

export const Failure = ({
  error,
}: CellFailureProps<FindBlogPostQueryVariables>) => (
  <div style={{ color: 'red' }}>Error: {error?.message}</div>
)

export const Success = ({
  blogPost,
}: CellSuccessProps<FindBlogPostQuery, FindBlogPostQueryVariables>) => (
  <BlogPost blogPost={blogPost} />
)
