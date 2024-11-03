
const Input = ({type, label, name, value, handleChange, className}) => {
  return (
    <div className={`flex flex-col gap-1 text-xs ${className}`}>
      <label >{label}</label>
      <input type={type} className="px-2 py-2 outline-none border-2 rounded-[8px] border-softGray " name={name} value={value} onChange={handleChange} />
    </div>
  )
}

export default Input