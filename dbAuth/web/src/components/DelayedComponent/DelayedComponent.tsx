import { Suspense, useState, use, useRef } from 'react'

import { useServerInsertedHTML } from '@redwoodjs/web'

function DelayedComponent({
  time,
  delays,
}: {
  time: number
  delays: Map<number, Promise<void>>
}) {
  const logged = useRef(false)
  if (typeof window === 'undefined') {
    const delay =
      delays.get(time) ??
      new Promise<void>((resolve) => setTimeout(resolve, time * 1000))
    delays.set(time, delay)
    use(delay)

    // eslint-disable-next-line react-hooks/rules-of-hooks
    useServerInsertedHTML(() => {
      if (!logged.current) {
        logged.current = true
        return (
          <script
            dangerouslySetInnerHTML={{
              __html: `console.log("delayed by ${time} seconds")`,
            }}
          />
        )
      }
      return <></>
    })
  }
  return <>Delayed by {time} seconds</>
}

export default function DelayedStuff() {
  const [delays] = useState(new Map<number, Promise<void>>())
  return (
    <>
      <Suspense>
        <DelayedComponent time={1} delays={delays} />
        <br />
      </Suspense>
      <Suspense>
        <DelayedComponent time={2} delays={delays} />
        <br />
      </Suspense>
      <Suspense>
        <DelayedComponent time={3} delays={delays} />
        <br />
      </Suspense>
      <Suspense>
        <DelayedComponent time={4} delays={delays} />
        <br />
      </Suspense>
    </>
  )
}
