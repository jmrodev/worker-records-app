const Button = (
    { text, onClick, type = "button", disabled = false, className = "" } = {} // Destructuring props with default values
) => {
    return (
        <button
            type="submit"
            onClick={() =>
                onClick ? onClick() : null
            }
            disabled={disabled}
            className={`btn ${className}`}

        >
            {text}
            
        </button>
    )
}

export default Button;