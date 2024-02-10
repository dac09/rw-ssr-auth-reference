import React, { Fragment, ReactNode, useContext } from 'react'

type RenderCallbacks = () => ReactNode

const insertCallbacks: RenderCallbacks[] = new Set([])
export const ServerHtmlContext = React.createContext<
  ((things: RenderCallbacks) => void) | null
>(null)

// @TODO move this into a factory, i.e. create a new context provider and state
// for each request
export const ServerInsertHtmlRender = () => {
  return insertCallbacks.map((component, index) => {
    return <Fragment key={index}>{component()}</Fragment>
  })
}

export function useServerInsertedHTML(callback: () => React.ReactNode): void {
  const addInsertedServerHTMLCallback = useContext(ServerHtmlContext)

  // Should have no effects on client where there's no flush effects provider
  if (addInsertedServerHTMLCallback) {
    addInsertedServerHTMLCallback(callback)
  }
}
export const addToThingsToRender = (x: any) => {
  insertCallbacks.push(x)
}
