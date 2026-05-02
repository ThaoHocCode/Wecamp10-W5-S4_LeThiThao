function Create({ task, setTask, onAdd, loading }) {
  const handleKeyDown = (event) => {
    if (event.key === 'Enter') {
      onAdd()
    }
  }

  return (
    <div className="create_form">
      <input
        type="text"
        value={task}
        onChange={(event) => setTask(event.target.value)}
        onKeyDown={handleKeyDown}
        placeholder="Enter Task"
      />
      <button type="button" onClick={onAdd} disabled={loading}>
        Add
      </button>
    </div>
  )
}

export default Create;