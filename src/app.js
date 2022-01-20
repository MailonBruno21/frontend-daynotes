import React, {useState, useEffect} from 'react';

import api from './services/api';

import './app.css'
import './global.css'
import './sidebar.css'
import './main.css'

import Notes from './Components/Notes/index'
import RadioButtons from './Components/RadioButton';

function App() {

  const [ selectedValue, setSelectedValue ] = useState('all')
  const [title, setTitles] = useState('')
  const [notes, setNotes] = useState('')
  const [AllNotes, setAllNotes] = useState([])


  useEffect(() => {
    
    getAllNotes()
  },[])
  
  async function getAllNotes(){
    const response = await api.get('/annotations',)
    setAllNotes(response.data)
  }

  async function loadNotes(option){
    const params = {priority: option}
    const response = await api.get('/priorities', { params})

    if(response){
      setAllNotes(response.data)
    }
  }

  function handleChange(e){
    setSelectedValue(e.value)
    
    if (e.checked && e.value != 'all' ){
      loadNotes(e.value)
    }else{
      getAllNotes()
    }
  }


  async function hadleDelete(id){
      const deletedNote = await api.delete(`/annotations/${id}`)

      if(deletedNote){
          setAllNotes(AllNotes.filter(note => note._id != id))
      }
  }

  async function hadleChangePriority(id){
      const note = await api.put(`/priorities/${id}`)

      if (note && selectedValue != 'all'){
        loadNotes(selectedValue)
      }else{
        getAllNotes();
      }
  }


  async function handleSubmit(e){
    e.preventDefault()

    const response = await api.post('/annotations',{
      title,
      notes,
      priority: false
    })

    setTitles('')
    setNotes('')

    if(selectedValue != 'all'){
      getAllNotes()
    }else{
      setAllNotes([...AllNotes, response.data])
    }

    setSelectedValue('all')


  }

  useEffect(() => {
    function enableSubmitButton(){
      let btn = document.getElementById('btn_submit')
      btn.style.background = "#FFD3CA"
      if(title && notes){
        btn.style.background = '#eb8f7a' 
      }
    }

    enableSubmitButton()
  },[title, notes])



  return (
    <div id='app'>
      <aside>
        <strong>Caderno de Notas</strong>
        <form onSubmit={handleSubmit}>
          <div className='input-block'>
            <label htmlFor='title'>Título da anotação</label>
            <input 
              required
              maxLength="30"
              value={title}
              onChange={e => setTitles(e.target.value)}
            />
          </div>

          <div className='input-block'>
            <label htmlFor='nota'>Anotações</label>
            <textarea 
            required
            value={notes}
            onChange={e => setNotes(e.target.value)}
            
            />
          </div>

          <button id='btn_submit' type='submit'>Salvar</button>
        </form>

        {/* <RadioButton /> */}
        {/* <Button></Button> */}
        <RadioButtons 
          selectedValue={selectedValue}
          handleChange={handleChange}
        />
      </aside>


      <main>
        <ul>
          {AllNotes.map(data => (
            <Notes 
            key={data._id}
            data={data}
            handleDelete={hadleDelete}
            hadleChangePriority={hadleChangePriority}
            />                  
          ))}
        </ul>
      </main>    
    </div>
  );
}

export default App;
