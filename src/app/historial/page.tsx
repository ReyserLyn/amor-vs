'use client';

import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { Button } from '@/components/ui/button';
import Link from 'next/link';

export default function HistorialPage() {
  const [historial, setHistorial] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<'all' | 'Reyser' | 'Marilyn'>('all');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const itemsPerPage = 20;

  useEffect(() => {
    fetchHistorial();
  }, [filter, page]);

  const fetchHistorial = async () => {
    setLoading(true);
    
    let query = supabase
      .from('clicks')
      .select('username, created_at', { count: 'exact' })
      .order('created_at', { ascending: false });
    
    if (filter !== 'all') {
      query = query.eq('username', filter);
    }
    
    const from = (page - 1) * itemsPerPage;
    const to = from + itemsPerPage - 1;
    
    const { data, count } = await query.range(from, to);
    
    // Agrupar por día
    const groupedByDay: { [key: string]: { [user: string]: number } } = {};
    (data || []).forEach((row) => {
      const date = new Date(row.created_at).toDateString();
      if (!groupedByDay[date]) groupedByDay[date] = { Reyser: 0, Marilyn: 0 };
      groupedByDay[date][row.username]++;
    });
    
    const historialArray = Object.entries(groupedByDay).map(([date, counts]) => ({
      date,
      counts
    }));
    
    setHistorial(historialArray);
    setTotalPages(Math.ceil((count || 0) / itemsPerPage));
    setLoading(false);
  };

  return (
    <main className="p-8 min-h-screen bg-gradient-to-br from-pink-50 to-red-50">
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-3xl font-bold bg-gradient-to-r from-pink-600 to-red-600 bg-clip-text text-transparent">
            Historial Completo
          </h1>
          <Button asChild variant="outline">
            <Link href="/">← Volver al contador</Link>
          </Button>
        </div>

        {/* Filtros */}
        <div className="flex gap-2 mb-6">
          <Button
            variant={filter === 'all' ? 'default' : 'outline'}
            onClick={() => setFilter('all')}
          >
            Todos
          </Button>
          <Button
            variant={filter === 'Reyser' ? 'default' : 'outline'}
            onClick={() => setFilter('Reyser')}
          >
            Reyser
          </Button>
          <Button
            variant={filter === 'Marilyn' ? 'default' : 'outline'}
            onClick={() => setFilter('Marilyn')}
          >
            Marilyn
          </Button>
        </div>

        {/* Historial */}
        {loading ? (
          <div className="text-center py-8">Cargando historial...</div>
        ) : (
          <div className="space-y-4">
            {historial.map((h, i) => (
              <div key={i} className="bg-white/60 backdrop-blur-sm rounded-xl p-6 shadow-lg">
                <div className="text-lg font-semibold mb-3">
                  {new Date(h.date).toLocaleDateString('es-ES', { 
                    weekday: 'long',
                    day: 'numeric', 
                    month: 'long', 
                    year: 'numeric' 
                  })}
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {['Reyser', 'Marilyn'].map((name) => (
                    h.counts[name] > 0 && (
                      <div key={name} className="flex items-center gap-3">
                        <span className="text-2xl">❤️</span>
                        <div>
                          <div className="font-medium">{name}</div>
                          <div className="text-gray-600">
                            {h.counts[name]} te amo{h.counts[name] > 1 ? 's' : ''}
                          </div>
                        </div>
                      </div>
                    )
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Paginación */}
        {totalPages > 1 && (
          <div className="flex justify-center gap-2 mt-8">
            <Button
              variant="outline"
              disabled={page === 1}
              onClick={() => setPage(page - 1)}
            >
              Anterior
            </Button>
            <span className="flex items-center px-4">
              Página {page} de {totalPages}
            </span>
            <Button
              variant="outline"
              disabled={page === totalPages}
              onClick={() => setPage(page + 1)}
            >
              Siguiente
            </Button>
          </div>
        )}
      </div>
    </main>
  );
} 