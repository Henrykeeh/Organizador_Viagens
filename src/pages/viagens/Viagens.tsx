import React, { useEffect, useState } from "react";

type Viagem = {
  id: number;
  origem: string;
  destino: string;
  data: string;
  hora: string;
  plataforma: string;
  passageiros: string;
};

// Fuso de Brasília
const createDateInSaoPaulo = (dateStr: string, timeStr: string) => {
  return new Date(`${dateStr}T${timeStr}:00.000-03:00`);
};

const getTodayInSaoPaulo = () => {
  const now = new Date();

  // Converte para string no fuso de São Paulo (formato dd/mm/aaaa)
  const parts = now.toLocaleDateString("pt-BR", { timeZone: "America/Sao_Paulo" }).split("/");

  // Reorganiza para yyyy-MM-dd (padrão do input date)
  const [dia, mes, ano] = parts;
  return `${ano}-${mes.padStart(2, "0")}-${dia.padStart(2, "0")}`;
};


// Countdown legível a partir da diferença em ms
const formatCountdown = (diffMs: number) => {
  if (diffMs <= 0) return "Já passou";
  const totalSeconds = Math.floor(diffMs / 1000);
  const days = Math.floor(totalSeconds / 86400);
  const hours = Math.floor((totalSeconds % 86400) / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;

  if (days > 0) return `Faltam ${days}d ${hours}h`;
  if (hours > 0) return `Faltam ${hours}h ${minutes}m`;
  if (minutes > 0) return `Faltam ${minutes}m ${seconds}s`;
  return `Faltam ${seconds}s`;
};

export default function Viagens() {
  const [viagens, setViagens] = useState<Viagem[]>([]);
  const [form, setForm] = useState<Omit<Viagem, "id">>({
    origem: "São Paulo",
    destino: "",
    data: getTodayInSaoPaulo(),
    hora: "",
    plataforma: "",
    passageiros: "",
  });

  const [now, setNow] = useState<Date>(new Date());

  const deleteViagem = (id: number) => {
    setViagens((prev) => prev.filter((v) => v.id !== id));
  };

  const updatePassageiros = (id: number, value: string) => {
    setViagens((prev) =>
      prev.map((v) =>
        v.id === id ? { ...v, passageiros: value } : v
      )
    );
  };


  useEffect(() => {
    const timer = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    const savedViagens = localStorage.getItem("viagens");
    if (savedViagens) {
      setViagens(JSON.parse(savedViagens));
    }
  }, []);

  useEffect(() => {
    localStorage.setItem("viagens", JSON.stringify(viagens));
  }, [viagens]);

  const addViagem = (e: React.FormEvent) => {
    e.preventDefault();
    const nova: Viagem = { id: Date.now(), ...form };
    setViagens((prev) =>
      [...prev, nova].sort(
        (a, b) =>
          createDateInSaoPaulo(a.data, a.hora).getTime() -
          createDateInSaoPaulo(b.data, b.hora).getTime()
      )
    );
    setForm({
      origem: "São Paulo",
      destino: "",
      data: getTodayInSaoPaulo(),
      hora: "",
      plataforma: "",
      passageiros: "",
    });
  };

  const clearAllViagens = () => {
    if (window.confirm("Tem certeza que deseja apagar todas as viagens?")) {
      setViagens([]);
      localStorage.removeItem("viagens");
    }
  };

  const viagensAtivas = viagens.filter(
    (v) => createDateInSaoPaulo(v.data, v.hora).getTime() > now.getTime()
  );
  const viagensPassadas = viagens.filter(
    (v) => createDateInSaoPaulo(v.data, v.hora).getTime() <= now.getTime()
  );

  const getCardColorClass = (data: string, hora: string) => {
    const tripDate = createDateInSaoPaulo(data, hora);
    const diffMs = tripDate.getTime() - now.getTime();
    const diffMin = Math.floor(diffMs / 60000);

    if (diffMs < 0) return "bg-gray-700 text-gray-200 opacity-80";
    if (diffMin <= 10) return "bg-red-600 text-white";
    if (diffMin <= 30) return "bg-yellow-400 text-gray-900";
    return "bg-green-400 text-gray-900";
  };

  return (
    <div className="p-6 space-y-4 bg-slate-900 text-gray-100 min-h-screen">
      {/* Relógio no topo */}
      <div className="text-center text-3xl font-bold tracking-tight text-white mb-6">
        {new Date().toLocaleString("pt-BR", {
          day: "2-digit",
          month: "2-digit",
          year: "numeric",
          timeZone: "America/Sao_Paulo",
        })}{" "}
        -{" "}
        {new Date().toLocaleTimeString("pt-BR", {
          hour: "2-digit",
          minute: "2-digit",
          second: "2-digit",
          timeZone: "America/Sao_Paulo",
        })}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {/* Formulário de card */}
        <form
          onSubmit={addViagem}
          className="bg-slate-800 bg-opacity-10 backdrop-filter backdrop-blur-md p-6 rounded-xl shadow-2xl space-y-4 border border-gray-700/50 md:col-span-1"
        >
          <h2 className="text-xl font-bold text-white mb-2">Adicionar Viagem</h2>
          {/* Mostra a data no formato dd/mm/aaaa acima do input */}
          {/* <label className="block text-sm text-gray-300 mb-1">
            Data atual:{" "}
            {form.data
              ? form.data.split("-").reverse().join("/")
              : ""}
          </label> */}
          <input
            value={form.origem}
            onChange={(e) => setForm({ ...form, origem: e.target.value })}
            placeholder="Origem"
            className="w-full p-3 border border-gray-600 rounded-lg text-sm bg-slate-700/50 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors"
            required
          />
          <input
            value={form.destino}
            onChange={(e) => setForm({ ...form, destino: e.target.value })}
            placeholder="Destino"
            className="w-full p-3 border border-gray-600 rounded-lg text-sm bg-slate-700/50 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors"
            required
          />
          <input
            value={form.data}
            onChange={(e) => setForm({ ...form, data: e.target.value })}
            type="date"
            className="w-full p-3 border border-gray-600 rounded-lg text-sm bg-slate-700/50 text-white focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors"
            required
          />
          <input
            value={form.hora}
            onChange={(e) => setForm({ ...form, hora: e.target.value })}
            type="time"
            className="w-full p-3 border border-gray-600 rounded-lg text-sm bg-slate-700/50 text-white focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors"
            required
          />
          <input
            value={form.plataforma}
            onChange={(e) => setForm({ ...form, plataforma: e.target.value })}
            placeholder="Plataforma"
            type="number"
            className="w-full p-3 border border-gray-600 rounded-lg text-sm bg-slate-700/50 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors"
            required
          />
          <input
            value={form.passageiros}
            onChange={(e) => setForm({ ...form, passageiros: e.target.value })}
            placeholder="Número de Passageiros"
            type="number"
            className="w-full p-3 border border-gray-600 rounded-lg text-sm bg-slate-700/50 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors"
            required
          />
          <button className="cursor-pointer w-full bg-blue-900 text-white font-bold py-3 rounded-lg text-sm hover:bg-blue-950 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50">
            Adicionar
          </button>
          <button
            type="button"
            onClick={clearAllViagens}
            className="cursor-pointer w-full bg-red-800 text-white font-bold py-3 rounded-lg text-sm hover:bg-red-900 transition-colors focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-opacity-50 mt-2"
          >
            Limpar todas as viagens
          </button>
        </form>

        <div className="md:col-span-3 space-y-6">
          {/* Listas de Viagens */}
          <div>
            <h2 className="text-xl font-bold mb-3">Viagens Ativas</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              {viagensAtivas.map((v) => {
                const tripDate = createDateInSaoPaulo(v.data, v.hora);
                const diffMs = tripDate.getTime() - now.getTime();
                const cardColorClass = getCardColorClass(v.data, v.hora);
                const passageirosTextClass = cardColorClass.includes("bg-red-600") ? "text-white" : "text-black";
                const passageirosInputClass = cardColorClass.includes("bg-red-600") ? "text-white" : "text-black";
                return (
                  <div
                    key={v.id}
                    className={`relative p-4 rounded-lg shadow-lg text-sm ${getCardColorClass(
                      v.data,
                      v.hora
                    )}`}
                  >
                    {/* Botão X */}
                    <button
                      onClick={() => deleteViagem(v.id)}
                      className="cursor-pointer absolute top-2 right-2 text-black hover:text-red-500 font-bold text-lg"
                      title="Remover viagem"
                      type="button"
                    >
                      ×
                    </button>
                    <div className="flex flex-col gap-1">
                      <p className="font-semibold text-base">
                        {v.origem} → {v.destino}
                      </p>
                      <p className="text-xs">
                        {tripDate.toLocaleString("pt-BR", {
                          day: "2-digit",
                          month: "2-digit",
                          year: "numeric",
                          hour: "2-digit",
                          minute: "2-digit",
                          timeZone: "America/Sao_Paulo",
                        })}
                      </p>
                      <p className="text-xs">Plataforma {v.plataforma}</p>
                    </div>
                    {/* Alinhamento passageiros e countdown */}
                    <div className="flex justify-between items-center mt-4">
                      <div className="flex flex-row items-center gap-2">
                        <span className={`text-xs flex items-center gap-1 ${passageirosTextClass}`}>
                          <span role="img" aria-label="Passageiros">👤</span> Passageiros
                        </span>
                        <input
                          type="number"
                          min="0"
                          value={v.passageiros}
                          onChange={(e) => updatePassageiros(v.id, e.target.value)}
                          className={`w-10 p-1 text-sm rounded-md focus:outline-none ${passageirosInputClass}`}
                        />
                      </div>
                      <div className="flex flex-col items-end font-mono text-sm font-bold text-right leading-tight">
                        {(() => {
                          const countdown = formatCountdown(diffMs);
                          if (countdown === "Já passou") {
                            return <span>{countdown}</span>;
                          }
                          // Remove "Faltam " do início e separa o restante
                          const [prefix, ...rest] = countdown.split(" ");
                          return (
                            <>
                              <span>{prefix}</span>
                              <span>{rest.join(" ")}</span>
                            </>
                          );
                        })()}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          <div>
            <h2 className="text-xl font-bold mb-3">Viagens Passadas</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              {viagensPassadas.map((v) => {
                const tripDate = createDateInSaoPaulo(v.data, v.hora);
                const diffMs = tripDate.getTime() - now.getTime();
                return (
                  <div
                    key={v.id}
                    className={`relative p-4 rounded-lg shadow-lg text-sm ${getCardColorClass(
                      v.data,
                      v.hora
                    )}`}
                  >
                    {/* Botão X */}
                    <button
                      onClick={() => deleteViagem(v.id)}
                      className="cursor-pointer absolute top-2 right-2 text-black hover:text-red-500 font-bold text-lg"
                      title="Remover viagem"
                      type="button"
                    >
                      ×
                    </button>

                    <div className="flex flex-col gap-1">
                      <p className="font-semibold text-base">
                        {v.origem} → {v.destino}
                      </p>
                      <p className="text-xs">
                        {tripDate.toLocaleString("pt-BR", {
                          day: "2-digit",
                          month: "2-digit",
                          year: "numeric",
                          hour: "2-digit",
                          minute: "2-digit",
                          timeZone: "America/Sao_Paulo",
                        })}
                      </p>
                      <p className="text-xs">Plataforma {v.plataforma}</p>
                    </div>

                    {/* Alinhamento passageiros e countdown igual às ativas */}
                    <div className="flex justify-between items-center mt-4">
                      <div className="flex flex-row items-center gap-2">
                        <span className="text-xs text-black flex items-center gap-1">
                          <span role="img" aria-label="Passageiros">👤</span> Passageiros:
                        </span>
                        <span className="text-sm font-semibold text-black">{v.passageiros}</span>
                      </div>
                      <div className="flex flex-col items-end font-mono text-sm font-bold text-right leading-tight">
                        {(() => {
                          const countdown = formatCountdown(diffMs);
                          if (countdown === "Já passou") {
                            return <span>{countdown}</span>;
                          }
                          const [prefix, ...rest] = countdown.split(" ");
                          return (
                            <>
                              <span>{prefix}</span>
                              <span>{rest.join(" ")}</span>
                            </>
                          );
                        })()}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}