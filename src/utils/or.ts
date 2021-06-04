export const or = (...args): Boolean => {
  return args.some((item) => {
    return (typeof item === 'function') ? item() : !!item
  })
}