import React from 'react'
import { useNavigate } from 'react-router-dom'

function Home() {
  const navigate = useNavigate();

  return (
    // Container principal
    <div className='bg-slate-900 text-gray-100 min-h-screen flex flex-col items-center justify-center p-6'>
      {/* Título principal */}
      <h1 className='text-5xl md:text-6xl font-extrabold text-center tracking-tight mb-8'>
        Organizador de Viagens
      </h1>

      {/* Caixa de conteúdo central */}
      <div className='bg-slate-800 bg-opacity-10 backdrop-filter backdrop-blur-md p-8 sm:p-10 rounded-xl shadow-2xl text-center border border-gray-700/50 max-w-lg w-full'>
        <p className='text-lg sm:text-xl font-medium mb-6'>
          Sua ferramenta para organizar as viagens de forma simples e eficiente.
        </p>
        <button
          className='cursor-pointer w-full sm:w-auto bg-blue-900 hover:bg-blue-950 active:bg-blue-800 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 text-white font-bold py-3 px-8 rounded-full transition-all duration-300 transform hover:scale-105'
          onClick={() => navigate("/viagens")}
        >
          Ir organizar viagens
        </button>
      </div>
    </div>
  )
}

export default Home;