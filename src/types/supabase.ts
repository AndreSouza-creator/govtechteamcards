
export type Departamento = 
  | "Govtech" 
  | "Marketing" 
  | "Inovação"
  | "ServiceDesk"
  | "Grandes Contas" 
  | "Varejo" 
  | "Financeiro" 
  | "Fiscal"
  | "Saúde"
  | "Projetos"
  | "Corporativo";

export interface TeamMember {
  id: string;
  nome: string;
  cargo: string;
  tel: string | null;
  email: string;
  site: string;
  portfolio: string;
  departamento: Departamento;
  image_url: string | null;
  administrador: boolean;
  user_id: string | null;
}
