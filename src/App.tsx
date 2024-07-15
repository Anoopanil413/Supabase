import { useEffect, useState } from 'react'

import './App.css'


import Routes from './Authentication'
import { store } from './Store/store'
import { Provider } from 'react-redux'

function App() {



  return(
    <>
    <Provider store={store}>
    <Routes/>
    </Provider>

    </>
  )

    
}

export default App
