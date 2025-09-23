export const Input = ({ className, ...props }: React.ComponentProps<"input">) => {
    return (
      <input
        className={className}
        {...props}
      />
    )
  }