import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { base44 } from '../api/base44Client';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { 
  LayoutDashboard, 
  Users, 
  Package, 
  AlertCircle, 
  Calendar,
  UserCheck,
  Menu,
  X,
  LogOut,
  Building2,
  User,
  KeyRound,
  ShieldAlert,
  Lock,
  StickyNote,
  Minus,
  Maximize2,
  Save,
  ArrowRightLeft
} from 'lucide-react';
import { Button, Card, CardContent, CardHeader, CardTitle, Label, Select, SelectContent, SelectItem, SelectTrigger, SelectValue, Popover, PopoverContent, PopoverTrigger, Input, Textarea } from './ui';

// --- Notepad Modal Component (Global) ---
function NotepadModal({ 
  isOpen, 
  isMinimized,
  onClose, 
  onMinimize,
  onMaximize,
  onSaveRequest 
}: { 
  isOpen: boolean, 
  isMinimized: boolean,
  onClose: () => void, 
  onMinimize: () => void,
  onMaximize: () => void,
  onSaveRequest: (text: string) => void 
}) {
  const [text, setText] = useState('');

  // Persist text even if closed/minimized (basic local state, ideally could be in Layout state too)
  // For now, we keep it simple. If closed completely, text is lost? 
  // Let's make text state lifted up or just rely on component not unmounting in layout.
  // Since this component is inside Layout which persists, local state is preserved while minimized.
  // If closed (onClose), usually we want to clear or keep? Let's keep for now.

  if (!isOpen) return null;

  if (isMinimized) {
    return (
      <div className="fixed bottom-4 right-4 z-[100] animate-in slide-in-from-bottom-10 fade-in">
        <Button 
          onClick={onMaximize}
          className="h-14 w-14 rounded-full bg-yellow-500 hover:bg-yellow-600 text-white shadow-xl border-2 border-white flex items-center justify-center relative"
          title="Abrir Bloco de Notas"
        >
          <StickyNote className="h-7 w-7" />
          {text.trim() && (
            <span className="absolute -top-1 -right-1 flex h-3.5 w-3.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-3.5 w-3.5 bg-red-500"></span>
            </span>
          )}
        </Button>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-in fade-in duration-200">
      <Card className="w-full max-w-3xl h-[80vh] flex flex-col shadow-2xl border-yellow-200 bg-[#fefce8] relative overflow-hidden">
        {/* Header de Bloco de Notas */}
        <div className="bg-yellow-100 border-b border-yellow-200 p-4 flex items-center justify-between">
          <div className="flex items-center gap-2 text-yellow-800">
            <StickyNote className="h-6 w-6" />
            <div>
              <h3 className="font-bold text-lg leading-none">Bloco de Notas de Plantão</h3>
              <p className="text-xs opacity-70">Escreva durante o turno. Minimize se precisar.</p>
            </div>
          </div>
          <div className="flex items-center gap-1">
            <Button variant="ghost" size="icon" onClick={onMinimize} className="text-yellow-800 hover:bg-yellow-200" title="Minimizar">
              <Minus className="h-5 w-5" />
            </Button>
            <Button variant="ghost" size="icon" onClick={onClose} className="text-yellow-800 hover:bg-yellow-200" title="Fechar">
              <X className="h-5 w-5" />
            </Button>
          </div>
        </div>

        {/* Área de Texto (Linhas de caderno) */}
        <div className="flex-1 p-0 relative bg-[#fefce8]">
          <textarea
            className="w-full h-full p-6 text-lg leading-8 bg-transparent border-none resize-none focus:ring-0 outline-none text-slate-800 font-medium"
            style={{ 
              backgroundImage: 'linear-gradient(transparent, transparent 31px, #e5e7eb 31px)',
              backgroundSize: '100% 32px',
              lineHeight: '32px'
            }}
            placeholder="Digite aqui as ocorrências do dia, observações ou pendências..."
            value={text}
            onChange={(e) => setText(e.target.value)}
            autoFocus
          />
        </div>

        {/* Footer Actions */}
        <div className="p-4 border-t border-yellow-200 bg-yellow-50 flex justify-end gap-3">
          <Button 
            type="button" 
            variant="ghost" 
            onClick={onMinimize}
            className="text-yellow-900 hover:bg-yellow-100"
          >
            Minimizar
          </Button>
          <Button 
            type="button" 
            onClick={() => {
              if (!text.trim()) return alert("O bloco de notas está vazio.");
              onSaveRequest(text);
            }}
            className="bg-yellow-600 hover:bg-yellow-700 text-white shadow-md border-yellow-700"
          >
            <Save className="h-4 w-4 mr-2" />
            Salvar em Ocorrências
          </Button>
        </div>
      </Card>
    </div>
  );
}

// --- Confirm Shift Handover Modal ---
function ConfirmHandoverModal({ isOpen, onClose, onConfirm, funcionarios }: any) {
  const [saindo, setSaindo] = useState('');
  const [entrando, setEntrando] = useState('');

  if (!isOpen) return null;

  const handleConfirm = () => {
    if (!saindo || !entrando) {
      alert("Selecione quem está saindo e quem está entrando.");
      return;
    }
    const funcSaindo = funcionarios.find((f: any) => f.id === saindo);
    const funcEntrando = funcionarios.find((f: any) => f.id === entrando);
    
    onConfirm({
      saindoId: saindo,
      saindoNome: funcSaindo?.nome_completo,
      entrandoId: entrando,
      entrandoNome: funcEntrando?.nome_completo
    });
  };

  return (
    <div className="fixed inset-0 z-[110] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-in zoom-in-95 duration-200">
      <Card className="w-full max-w-md shadow-2xl bg-white border-0">
        <CardHeader className="bg-slate-50 border-b pb-4">
          <CardTitle className="text-lg font-bold text-slate-800 flex items-center gap-2">
            <ArrowRightLeft className="h-5 w-5 text-blue-600" />
            Passagem de Posto
          </CardTitle>
        </CardHeader>
        <CardContent className="p-6 space-y-4">
          <p className="text-sm text-slate-600 mb-2">
            Para salvar as notas do turno, confirme os funcionários responsáveis pela passagem.
          </p>
          
          <div className="space-y-2">
            <Label>Funcionário Saindo (Entregando)</Label>
            <Select value={saindo} onValueChange={setSaindo}>
              <SelectTrigger>
                <SelectValue placeholder="Selecione..." />
              </SelectTrigger>
              <SelectContent>
                {funcionarios.map((f: any) => (
                  <SelectItem key={f.id} value={f.id}>{f.nome_completo}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label>Funcionário Entrando (Recebendo)</Label>
            <Select value={entrando} onValueChange={setEntrando}>
              <SelectTrigger>
                <SelectValue placeholder="Selecione..." />
              </SelectTrigger>
              <SelectContent>
                {funcionarios.map((f: any) => (
                  <SelectItem key={f.id} value={f.id}>{f.nome_completo}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="flex justify-end gap-3 pt-4">
            <Button type="button" variant="outline" onClick={onClose}>Cancelar</Button>
            <Button type="button" onClick={handleConfirm} className="bg-blue-600 hover:bg-blue-700 text-white">
              Confirmar e Salvar
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

// --- Componente de Login/Início de Turno ---
function ShiftLogin({ onLoginSuccess }: { onLoginSuccess: () => void }) {
  const [selectedFuncionario, setSelectedFuncionario] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  
  const { data: funcionarios = [], isLoading } = useQuery({
    queryKey: ['funcionarios'],
    queryFn: () => base44.entities.Funcionario.list(),
  });

  const handleStartShift = async () => {
    setError('');
    
    if (!selectedFuncionario) {
      setError('Selecione um funcionário.');
      return;
    }

    if (password !== 'cond@30') {
      setError('Senha incorreta. Tente novamente.');
      return;
    }
    
    const func = funcionarios.find((f: any) => f.id === selectedFuncionario);
    if (func) {
      await base44.auth.login(func.id, func.nome_completo);
      onLoginSuccess();
    }
  };

  const handleAdminAccess = async () => {
    await base44.auth.login('admin-temp', 'Administrador (Prov.)');
    onLoginSuccess();
  };

  const funcionariosAtivos = funcionarios.filter((f: any) => f.status === 'ativo');

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 to-slate-800 flex items-center justify-center p-4">
      <Card className="w-full max-w-md border-0 shadow-2xl bg-white/95 backdrop-blur">
        <CardHeader className="text-center pb-2">
          <div className="mx-auto w-16 h-16 bg-gradient-to-br from-cyan-500 to-blue-600 rounded-2xl flex items-center justify-center mb-4 shadow-lg">
            <Building2 className="h-8 w-8 text-white" />
          </div>
          <CardTitle className="text-2xl font-bold text-slate-900">Portaria Inteligente</CardTitle>
          <p className="text-slate-500">Identifique-se para iniciar o turno</p>
        </CardHeader>
        <CardContent className="space-y-6 pt-6">
          {isLoading ? (
             <p className="text-center text-slate-500">Carregando funcionários...</p>
          ) : (
            <>
              {funcionariosAtivos.length > 0 ? (
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label>Quem está assumindo o posto?</Label>
                    <Select value={selectedFuncionario} onValueChange={setSelectedFuncionario}>
                      <SelectTrigger className="h-12">
                        <SelectValue placeholder="Selecione seu nome" />
                      </SelectTrigger>
                      <SelectContent>
                        {funcionariosAtivos.map((f: any) => (
                          <SelectItem key={f.id} value={f.id}>
                            {f.nome_completo}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label>Senha de Acesso</Label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                      <Input 
                        type="password" 
                        placeholder="Digite a senha padrão"
                        className="pl-10 h-12"
                        value={password}
                        onChange={(e: any) => setPassword(e.target.value)}
                        onKeyDown={(e: any) => e.key === 'Enter' && handleStartShift()}
                      />
                    </div>
                  </div>

                  {error && (
                    <div className="bg-red-50 text-red-600 text-sm p-3 rounded-md flex items-center gap-2">
                      <AlertCircle className="h-4 w-4" />
                      {error}
                    </div>
                  )}

                  <Button 
                    type="button"
                    onClick={handleStartShift} 
                    className="w-full h-12 text-lg bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-700 hover:to-blue-700 shadow-lg"
                    disabled={!selectedFuncionario || !password}
                  >
                    <KeyRound className="mr-2 h-5 w-5" />
                    Iniciar Plantão
                  </Button>
                </div>
              ) : (
                <div className="space-y-4">
                  <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 flex items-start gap-3">
                    <ShieldAlert className="h-5 w-5 text-amber-600 shrink-0 mt-0.5" />
                    <div className="text-sm text-amber-800">
                      <p className="font-medium">Nenhum funcionário encontrado</p>
                      <p>Para começar, entre com acesso administrativo e cadastre os funcionários na aba "Funcionários".</p>
                    </div>
                  </div>
                  
                  <Button 
                    type="button"
                    onClick={handleAdminAccess} 
                    className="w-full h-12 bg-slate-800 hover:bg-slate-900 text-white shadow-lg"
                  >
                    Acesso Administrativo
                  </Button>
                </div>
              )}
            </>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

// --- Componente de Logout Action ---
function LogoutAction({ onConfirm }: { onConfirm: () => void }) {
  const [open, setOpen] = useState(false);

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          type="button"
          variant="destructive"
          size="sm"
          className="w-full justify-center gap-2 shadow-sm hover:bg-red-600"
        >
          <LogOut className="h-4 w-4" />
          Passar Plantão
        </Button>
      </PopoverTrigger>
      {/* Fix positioning: bottom-full pushes it up, mb-2 adds space */}
      <PopoverContent className="w-60 bottom-full mb-2 shadow-xl bg-white border-red-100" align="center">
        <div className="grid gap-4">
          <div className="space-y-2">
            <h4 className="font-medium leading-none flex items-center gap-2 text-red-600">
              <LogOut className="h-4 w-4" /> Confirmar Passagem
            </h4>
            <p className="text-sm text-muted-foreground">
              Deseja encerrar seu turno? O sistema retornará para a tela de login.
            </p>
          </div>
          <div className="flex flex-col gap-2">
            <Button 
              type="button" 
              variant="destructive" 
              size="sm" 
              className="w-full"
              onClick={() => {
                onConfirm();
                setOpen(false);
              }}
            >
              Confirmar e Sair
            </Button>
            <Button 
              type="button" 
              variant="ghost" 
              size="sm" 
              className="w-full"
              onClick={() => setOpen(false)}
            >
              Cancelar
            </Button>
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );
}

export default function Layout({ children, currentPageName }: any) {
  const [user, setUser] = useState<any>(null);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [loadingSession, setLoadingSession] = useState(true);
  
  // Notepad global state
  const [showNotepad, setShowNotepad] = useState(false);
  const [isNotepadMinimized, setIsNotepadMinimized] = useState(false);
  const [showHandoverModal, setShowHandoverModal] = useState(false);
  const [notepadTextToSave, setNotepadTextToSave] = useState('');

  const queryClient = useQueryClient();
  const { data: funcionarios = [] } = useQuery({
    queryKey: ['funcionarios'],
    queryFn: () => base44.entities.Funcionario.list(),
  });

  const createOcorrencia = useMutation({
    mutationFn: (data: any) => base44.entities.Ocorrencia.create({
      ...data,
      data_registro: new Date().toISOString()
    }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['ocorrencias'] });
      setShowNotepad(false);
      setIsNotepadMinimized(false);
      setShowHandoverModal(false);
      alert('Ocorrência salva com sucesso!');
    },
  });

  useEffect(() => {
    const checkSession = async () => {
      try {
        const session = base44.auth.getSession();
        if (session) {
          setUser({ full_name: session.nome, email: 'Operador em Turno' });
        } else {
          setUser(null);
        }
      } catch (error) {
        console.error('Erro ao verificar sessão:', error);
      } finally {
        setLoadingSession(false);
      }
    };
    checkSession();

    // Listener para abrir notepad de qualquer lugar
    const handleOpenNotepad = () => {
      setShowNotepad(true);
      setIsNotepadMinimized(false);
    };
    window.addEventListener('open-global-notepad', handleOpenNotepad);
    
    return () => {
      window.removeEventListener('open-global-notepad', handleOpenNotepad);
    };
  }, []);

  const handleLoginSuccess = () => {
    const session = base44.auth.getSession();
    if (session) {
      setUser({ full_name: session.nome, email: 'Operador em Turno' });
    }
  };

  const handleLogout = async () => {
    await base44.auth.logout();
    setUser(null); // Force UI to update to ShiftLogin without reloading page
  };

  const handleNotepadSaveRequest = (text: string) => {
    setNotepadTextToSave(text);
    setShowHandoverModal(true);
  };

  const handleHandoverConfirm = (data: any) => {
    createOcorrencia.mutate({
      relato: notepadTextToSave,
      funcionario_saindo_id: data.saindoId,
      funcionario_saindo_nome: data.saindoNome,
      funcionario_entrando_id: data.entrandoId,
      funcionario_entrando_nome: data.entrandoNome,
      data_registro: new Date().toISOString()
    });
  };

  if (loadingSession) {
    return <div className="min-h-screen flex items-center justify-center bg-slate-50">Carregando...</div>;
  }

  // Se não tiver usuário logado, mostra a tela de login
  if (!user) {
    return <ShiftLogin onLoginSuccess={handleLoginSuccess} />;
  }

  const menuItems = [
    { name: 'Dashboard', icon: LayoutDashboard, path: '/' },
    { name: 'Encomendas', icon: Package, path: '/encomendas' },
    { name: 'Itens Recebidos', icon: Package, path: '/itens-recebidos' },
    { name: 'Materiais', icon: Package, path: '/materiais' },
    { name: 'Visitantes', icon: Users, path: '/visitantes' },
    { name: 'Ocorrências', icon: AlertCircle, path: '/ocorrencias' },
    { name: 'Moradores', icon: Users, path: '/moradores' },
    { name: 'Funcionários', icon: UserCheck, path: '/funcionarios' },
    { name: 'Folha de Ponto', icon: Calendar, path: '/folha-ponto' },
    { name: 'Empresas', icon: Building2, path: '/empresas' },
    { name: 'Entregadores', icon: UserCheck, path: '/entregadores' },
    { name: 'Visitas Entregadores', icon: Package, path: '/visitas-entregadores' }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-cyan-50">
      {/* Global Components */}
      <NotepadModal 
        isOpen={showNotepad} 
        isMinimized={isNotepadMinimized}
        onClose={() => setShowNotepad(false)} 
        onMinimize={() => setIsNotepadMinimized(true)}
        onMaximize={() => setIsNotepadMinimized(false)}
        onSaveRequest={handleNotepadSaveRequest} 
      />

      <ConfirmHandoverModal 
        isOpen={showHandoverModal}
        onClose={() => setShowHandoverModal(false)}
        onConfirm={handleHandoverConfirm}
        funcionarios={funcionarios}
      />

      {/* Sidebar Desktop */}
      <aside className="hidden lg:flex lg:flex-col lg:fixed lg:inset-y-0 lg:w-64 bg-white/80 backdrop-blur-xl border-r border-slate-200/50 shadow-xl z-40">
        <div className="flex-1 flex flex-col">
          {/* Logo */}
          <div className="h-20 flex items-center px-6 border-b border-slate-200/50">
            <Building2 className="h-8 w-8 text-cyan-600" />
            <div className="ml-3">
              <h1 className="text-xl font-bold text-slate-800">Portaria</h1>
              <p className="text-xs text-slate-500">Sistema de Gestão</p>
            </div>
          </div>

          {/* Menu */}
          <nav className="flex-1 px-3 py-6 space-y-1 overflow-y-auto">
            {menuItems.map((item) => {
              const Icon = item.icon;
              const isActive = currentPageName === item.path;
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200 ${
                    isActive
                      ? 'bg-gradient-to-r from-cyan-600 to-blue-600 text-white shadow-lg shadow-cyan-500/20'
                      : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
                  }`}
                >
                  <Icon className="h-5 w-5" />
                  <span>{item.name}</span>
                </Link>
              );
            })}
          </nav>

          {/* User Info */}
          <div className="p-4 border-t border-slate-200/50 bg-slate-50/50">
            <div className="flex items-center gap-3 mb-3">
              <div className="h-10 w-10 rounded-full bg-gradient-to-br from-cyan-600 to-blue-600 flex items-center justify-center text-white font-semibold shadow-md">
                <User className="h-5 w-5" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-xs text-slate-500 font-medium uppercase tracking-wider">Operador</p>
                <p className="text-sm font-bold text-slate-900 truncate">{user.full_name}</p>
              </div>
            </div>
            <LogoutAction onConfirm={handleLogout} />
          </div>
        </div>
      </aside>

      {/* Mobile Header */}
      <header className="lg:hidden fixed top-0 left-0 right-0 h-16 bg-white/80 backdrop-blur-xl border-b border-slate-200/50 shadow-sm z-50 flex items-center justify-between px-4">
        <div className="flex items-center gap-2">
          <Building2 className="h-6 w-6 text-cyan-600" />
          <h1 className="text-lg font-bold text-slate-800">Portaria</h1>
        </div>
        <Button
          variant="ghost"
          size="icon"
          onClick={() => setSidebarOpen(!sidebarOpen)}
        >
          {sidebarOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </Button>
      </header>

      {/* Mobile Sidebar */}
      {sidebarOpen && (
        <>
          <div 
            className="lg:hidden fixed inset-0 bg-black/50 z-40"
            onClick={() => setSidebarOpen(false)}
          />
          <aside className="lg:hidden fixed inset-y-0 left-0 w-64 bg-white z-50 shadow-2xl">
            <div className="flex flex-col h-full">
              <div className="h-16 flex items-center justify-between px-4 border-b border-slate-200">
                <div className="flex items-center gap-2">
                  <Building2 className="h-6 w-6 text-cyan-600" />
                  <h1 className="text-lg font-bold text-slate-800">Portaria</h1>
                </div>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setSidebarOpen(false)}
                >
                  <X className="h-5 w-5" />
                </Button>
              </div>

              <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
                {menuItems.map((item) => {
                  const Icon = item.icon;
                  const isActive = currentPageName === item.path;
                  return (
                    <Link
                      key={item.path}
                      to={item.path}
                      onClick={() => setSidebarOpen(false)}
                      className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all ${
                        isActive
                          ? 'bg-gradient-to-r from-cyan-600 to-blue-600 text-white'
                          : 'text-slate-600 hover:bg-slate-100'
                      }`}
                    >
                      <Icon className="h-5 w-5" />
                      <span>{item.name}</span>
                    </Link>
                  );
                })}
              </nav>

              <div className="p-4 border-t border-slate-200 bg-slate-50">
                <div className="flex items-center gap-3 mb-3">
                  <div className="h-10 w-10 rounded-full bg-gradient-to-br from-cyan-600 to-blue-600 flex items-center justify-center text-white font-semibold">
                    <User className="h-5 w-5" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs text-slate-500 font-medium uppercase">Operador</p>
                    <p className="text-sm font-bold text-slate-900 truncate">{user.full_name}</p>
                  </div>
                </div>
                <LogoutAction onConfirm={handleLogout} />
              </div>
            </div>
          </aside>
        </>
      )}

      {/* Main Content */}
      <main className="lg:pl-64 pt-16 lg:pt-0">
        <div className="min-h-screen">
          {children}
        </div>
      </main>
    </div>
  );
}--- START OF FILE pages/Ocorrencias.tsx ---


import React, { useState } from 'react';
import { base44 } from '../api/base44Client';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Card, CardContent, CardHeader, CardTitle, Button, Input, Select, SelectContent, SelectItem, SelectTrigger, SelectValue, Textarea, Label, Popover, PopoverContent, PopoverTrigger } from '../components/ui';
import { Plus, Search, FileText, Clock, ArrowRightLeft, X, Save, Trash2, AlertTriangle, PenLine } from 'lucide-react';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';

// --- Delete Action Component ---
function DeleteAction({ onConfirm }: { onConfirm: () => void }) {
  const [open, setOpen] = useState(false);

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          type="button"
          size="sm"
          variant="destructive"
          onClick={(e) => e.stopPropagation()}
        >
          <Trash2 className="h-4 w-4 mr-1" />
          Excluir
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-64 bottom-full mb-2" align="end">
        <div className="grid gap-4">
          <div className="space-y-2">
            <h4 className="font-medium leading-none flex items-center gap-2 text-red-600">
              <AlertTriangle className="h-4 w-4" /> Confirmar Exclusão
            </h4>
            <p className="text-sm text-muted-foreground">
              Esta ação não pode ser desfeita.
            </p>
          </div>
          <Button 
            type="button" 
            variant="destructive" 
            size="sm" 
            className="w-full"
            onClick={(e) => {
              e.stopPropagation();
              onConfirm();
              setOpen(false);
            }}
          >
            Confirmar Exclusão
          </Button>
        </div>
      </PopoverContent>
    </Popover>
  );
}

// --- Form ---
function OcorrenciaForm({ ocorrencia, onSubmit, onCancel }: any) {
  const [formData, setFormData] = useState(ocorrencia || {
    funcionario_saindo_id: '',
    funcionario_saindo_nome: '',
    funcionario_entrando_id: '',
    funcionario_entrando_nome: '',
    relato: ''
  });

  const { data: funcionarios = [] } = useQuery({
    queryKey: ['funcionarios'],
    queryFn: () => base44.entities.Funcionario.list(),
  });

  const handleFuncionarioSaindoChange = (funcId: string) => {
    const func = funcionarios.find((f: any) => f.id === funcId);
    setFormData({
      ...formData,
      funcionario_saindo_id: funcId,
      funcionario_saindo_nome: func?.nome_completo || ''
    });
  };

  const handleFuncionarioEntrandoChange = (funcId: string) => {
    const func = funcionarios.find((f: any) => f.id === funcId);
    setFormData({
      ...formData,
      funcionario_entrando_id: funcId,
      funcionario_entrando_nome: func?.nome_completo || ''
    });
  };

  const handleSubmit = () => {
    if (!formData.relato) {
      alert("O campo relato é obrigatório.");
      return;
    }
    onSubmit(formData);
  };

  return (
    <Card className="border-0 shadow-xl bg-white/90 backdrop-blur-sm mb-6">
      <CardHeader className="border-b">
        <div className="flex items-center justify-between">
          <CardTitle>{ocorrencia ? 'Editar Registro' : 'Nova Ocorrência / Passagem de Turno'}</CardTitle>
          <Button variant="ghost" size="icon" onClick={onCancel} type="button">
            <X className="h-5 w-5" />
          </Button>
        </div>
      </CardHeader>
      <CardContent className="p-6">
        <form onSubmit={(e) => e.preventDefault()} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <Label htmlFor="funcionario_saindo">Funcionário Saindo</Label>
              <Select 
                value={formData.funcionario_saindo_id} 
                onValueChange={handleFuncionarioSaindoChange}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Selecione">
                    {formData.funcionario_saindo_nome || "Selecione"}
                  </SelectValue>
                </SelectTrigger>
                <SelectContent>
                  {funcionarios.map((f: any) => (
                    <SelectItem key={f.id} value={f.id}>
                      {f.nome_completo} - {f.cargo}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="funcionario_entrando">Funcionário Entrando</Label>
              <Select 
                value={formData.funcionario_entrando_id} 
                onValueChange={handleFuncionarioEntrandoChange}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Selecione">
                    {formData.funcionario_entrando_nome || "Selecione"}
                  </SelectValue>
                </SelectTrigger>
                <SelectContent>
                  {funcionarios.map((f: any) => (
                    <SelectItem key={f.id} value={f.id}>
                      {f.nome_completo} - {f.cargo}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="md:col-span-2">
              <Label htmlFor="relato">Relato / Ocorrências *</Label>
              <Textarea
                id="relato"
                value={formData.relato}
                onChange={(e: any) => setFormData({ ...formData, relato: e.target.value })}
                placeholder="Descreva as ocorrências..."
                rows={8}
                required
                className="resize-none"
              />
            </div>
          </div>
          <div className="flex justify-end gap-3 pt-4 border-t">
            <Button type="button" variant="outline" onClick={onCancel}>
              Cancelar
            </Button>
            <Button 
              type="button" 
              onClick={handleSubmit}
              className="bg-gradient-to-r from-orange-600 to-red-600 hover:from-orange-700 hover:to-red-700"
            >
              <Save className="h-4 w-4 mr-2" />
              {ocorrencia ? 'Salvar' : 'Registrar'}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}

// --- Page ---
export default function Ocorrencias() {
  const [searchTerm, setSearchTerm] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [editingOcorrencia, setEditingOcorrencia] = useState<any>(null);
  const [viewingOcorrencia, setViewingOcorrencia] = useState<any>(null);
  const queryClient = useQueryClient();

  const { data: ocorrencias = [], isLoading } = useQuery({
    queryKey: ['ocorrencias'],
    queryFn: () => base44.entities.Ocorrencia.list('-created_date', 100),
    staleTime: 30000,
  });

  const createMutation = useMutation({
    mutationFn: (data: any) => base44.entities.Ocorrencia.create({
      ...data,
      data_registro: new Date().toISOString()
    }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['ocorrencias'] });
      setShowForm(false);
      setEditingOcorrencia(null);
    },
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }: any) => base44.entities.Ocorrencia.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['ocorrencias'] });
      setShowForm(false);
      setEditingOcorrencia(null);
      setViewingOcorrencia(null);
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (id: any) => base44.entities.Ocorrencia.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['ocorrencias'] });
    },
  });

  // Função para abrir o bloco de notas GLOBAL via evento customizado
  const openGlobalNotepad = () => {
    window.dispatchEvent(new CustomEvent('open-global-notepad'));
  };

  const filteredOcorrencias = ocorrencias.filter((o: any) => {
    const matchSearch = o.relato?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                       o.funcionario_saindo_nome?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                       o.funcionario_entrando_nome?.toLowerCase().includes(searchTerm.toLowerCase());
    return matchSearch;
  });

  return (
    <div className="p-6 lg:p-8 space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">Ocorrências e Passagem de Turno</h1>
          <p className="text-slate-600 mt-1">Registro de ocorrências e troca de turno</p>
        </div>
        <div className="flex gap-2">
          <Button
            type="button"
            onClick={openGlobalNotepad}
            className="bg-yellow-500 hover:bg-yellow-600 text-white shadow-lg"
          >
            <PenLine className="h-5 w-5 mr-2" />
            Bloco de Notas
          </Button>
          <Button
            type="button"
            onClick={() => {
              setEditingOcorrencia(null);
              setShowForm(true);
            }}
            className="bg-gradient-to-r from-orange-600 to-red-600 hover:from-orange-700 hover:to-red-700 shadow-lg"
          >
            <Plus className="h-5 w-5 mr-2" />
            Nova Ocorrência
          </Button>
        </div>
      </div>

      <Card className="border-0 shadow-lg bg-white/80 backdrop-blur-sm">
        <CardContent className="p-6">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400 pointer-events-none" size={20} style={{ opacity: 1 }} />
            <Input
              placeholder="Buscar por funcionário ou texto do relato..."
              value={searchTerm}
              onChange={(e: any) => setSearchTerm(e.target.value)}
              className="pl-10 !text-black"
              style={{ backgroundColor: 'white', color: 'black', height: '40px', opacity: 1 }}
            />
          </div>
        </CardContent>
      </Card>

      {showForm && (
        <OcorrenciaForm
          ocorrencia={editingOcorrencia}
          onSubmit={(data: any) => {
            if (editingOcorrencia) {
              updateMutation.mutate({ id: editingOcorrencia.id, data });
            } else {
              createMutation.mutate(data);
            }
          }}
          onCancel={() => {
            setShowForm(false);
            setEditingOcorrencia(null);
          }}
        />
      )}

      {viewingOcorrencia && (
        <Card className="border-0 shadow-xl bg-white/90 backdrop-blur-sm">
          <CardContent className="p-6">
            <div className="flex justify-between items-start mb-4">
              <h2 className="text-xl font-bold text-slate-900">Detalhes da Ocorrência</h2>
              <Button variant="ghost" size="icon" onClick={() => setViewingOcorrencia(null)} type="button">
                <Search className="h-5 w-5" />
              </Button>
            </div>

            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {viewingOcorrencia.funcionario_saindo_nome && (
                  <div>
                    <span className="text-sm text-slate-500">Funcionário Saindo:</span>
                    <p className="font-medium text-slate-900">{viewingOcorrencia.funcionario_saindo_nome}</p>
                  </div>
                )}
                {viewingOcorrencia.funcionario_entrando_nome && (
                  <div>
                    <span className="text-sm text-slate-500">Funcionário Entrando:</span>
                    <p className="font-medium text-slate-900">{viewingOcorrencia.funcionario_entrando_nome}</p>
                  </div>
                )}
                {viewingOcorrencia.data_registro && (
                  <div>
                    <span className="text-sm text-slate-500">Data:</span>
                    <p className="font-medium text-slate-900">
                      {format(new Date(viewingOcorrencia.data_registro), "dd/MM/yyyy 'às' HH:mm", { locale: ptBR })}
                    </p>
                  </div>
                )}
              </div>

              <div>
                <span className="text-sm text-slate-500">Relato:</span>
                <div className="mt-2 p-4 bg-slate-50 rounded-lg">
                  <p className="text-slate-700 whitespace-pre-wrap">{viewingOcorrencia.relato}</p>
                </div>
              </div>

              <div className="flex gap-2 pt-4 border-t">
                {/* Botão Editar removido conforme padrão */}
                <DeleteAction onConfirm={() => {
                  deleteMutation.mutate(viewingOcorrencia.id);
                  setViewingOcorrencia(null);
                }} />
                <Button
                  type="button"
                  onClick={() => setViewingOcorrencia(null)}
                  variant="ghost"
                  className="ml-auto"
                >
                  Fechar
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      <div className="grid gap-4">
        {isLoading ? (
          <Card className="p-8 text-center">
            <p className="text-slate-500">Carregando...</p>
          </Card>
        ) : filteredOcorrencias.length === 0 ? (
          <Card className="p-8 text-center border-0 shadow-lg">
            <FileText className="h-12 w-12 mx-auto text-slate-300 mb-3" />
            <p className="text-slate-500">Nenhuma ocorrência registrada</p>
          </Card>
        ) : (
          filteredOcorrencias.map((ocorrencia: any) => (
            <Card key={ocorrencia.id} className="border-0 shadow-lg hover:shadow-xl transition-all bg-white/80 backdrop-blur-sm">
              <CardContent className="p-6">
                <div className="flex flex-col lg:flex-row gap-6">
                  <div className="flex-shrink-0">
                    <div className="h-24 w-24 rounded-xl bg-orange-100 flex items-center justify-center">
                      <ArrowRightLeft className="h-10 w-10 text-orange-600" />
                    </div>
                  </div>

                  <div className="flex-1 space-y-3">
                    <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-2">
                      <div>
                        <div className="flex items-center gap-2 mb-2">
                          {ocorrencia.data_registro && (
                            <span className="text-sm text-slate-600 font-medium">
                              {format(new Date(ocorrencia.data_registro), "dd/MM/yyyy 'às' HH:mm", { locale: ptBR })}
                            </span>
                          )}
                        </div>

                        {(ocorrencia.funcionario_saindo_nome || ocorrencia.funcionario_entrando_nome) && (
                          <div className="flex items-center gap-2 text-sm text-slate-700 mb-2">
                            {ocorrencia.funcionario_saindo_nome && (
                              <span className="font-medium">{ocorrencia.funcionario_saindo_nome}</span>
                            )}
                            {ocorrencia.funcionario_saindo_nome && ocorrencia.funcionario_entrando_nome && (
                              <ArrowRightLeft className="h-4 w-4 text-slate-400" />
                            )}
                            {ocorrencia.funcionario_entrando_nome && (
                              <span className="font-medium">{ocorrencia.funcionario_entrando_nome}</span>
                            )}
                          </div>
                        )}
                      </div>
                    </div>

                    <div className="bg-slate-50 p-4 rounded-lg">
                      <p className="text-slate-700 line-clamp-3 whitespace-pre-wrap">
                        {ocorrencia.relato}
                      </p>
                    </div>

                    <div className="flex flex-wrap gap-2 pt-2 border-t">
                      <Button
                        type="button"
                        onClick={() => setViewingOcorrencia(ocorrencia)}
                        size="sm"
                        variant="outline"
                      >
                        Ver Detalhes
                      </Button>
                      <DeleteAction onConfirm={() => deleteMutation.mutate(ocorrencia.id)} />
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  );
}
