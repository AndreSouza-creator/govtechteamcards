
import jhonatas from "./../img/TeamPictures/JhonatasRocha.png";
import mauro from "./../img/TeamPictures/MauroMarsura.png";
import danilo from "./../img/TeamPictures/DaniloMaheli.png";
import hallan from "./../img/TeamPictures/HallanFernandes.png";
import argemiro from "./../img/TeamPictures/ArgemiroJr.png";
import andre from "./../img/TeamPictures/AndreSouza.png";
import marcos from "./../img/TeamPictures/MarcosRevite.png";
import josimar from "./../img/TeamPictures/JosimarCaitano.png";
import natalia from "./../img/TeamPictures/NataliaLeal.png";
import anna from "./../img/TeamPictures/AnaSartoriCarvalho.png";
import leonardo from "./../img/TeamPictures/LeonardoAmorin.png";

export type Departamento = 
  | "Govtech" 
  | "Marketing" 
  | "Inovação"
  | "Grandes contas" 
  | "Varejo" 
  | "Financeiro" 
  | "Fiscal"
  | "Saúde"
  | "Projetos"
  | "Corporativo";

export interface TeamMember {
  nome: string;
  cargo: string;
  tel: string;
  email: string;
  site: string;
  portfolio: string;
  departamento: Departamento;
  image?: string;
  administrador?: boolean;
}

export const teamMembers: TeamMember[] = [
  {
    nome: "Jhonatas Rocha",
    cargo: "Diretor",
    tel: "+55 11 98080-3677",
    email: "jhonatas.rocha@tecnocomp.com.br",
    site: "www.tecnocomp.com.br",
    portfolio: "www.tecnocomp.com.br/portfiolio",
    departamento: "Govtech",
    image: jhonatas,
    administrador: true
  },
  {
    nome: "Mauro Cesar Marsura",
    cargo: "Gerente de arquitetura de soluções",
    tel: "+55 11 98965-4809",
    email: "mauro.marsura@tecnocomp.com.br",
    site: "www.tecnocomp.com.br",
    portfolio: "www.tecnocomp.com.br/portfiolio",
    departamento: "Govtech",
    image: mauro
  },
  {
    nome: "Leonardo Araújo",
    cargo: "Account Manager",
    tel: "+55 61 98130-5411",
    email: "leonardo.araujo@tecnocomp.com.br",
    site: "www.tecnocomp.com.br",
    portfolio: "www.tecnocomp.com.br/portfiolio",
    departamento: "Govtech",
    image: leonardo
  },
  {
    nome: "Danilo Maheli Torres",
    cargo: "Account Manager",
    tel: "+55 11 96326-5453",
    email: "danilo.torres@tecnocomp.com.br",
    site: "www.tecnocomp.com.br",
    portfolio: "www.tecnocomp.com.br/portfiolio",
    departamento: "Govtech",
    image: danilo
  },
  {
    nome: "Hallan Rodrigues Fernandes",
    cargo: "Account Manager/Attorney",
    tel: "+55 11 91001-1073",
    email: "hallan.fernandes@tecnocomp.com.br",
    site: "www.tecnocomp.com.br",
    portfolio: "www.tecnocomp.com.br/portfiolio",
    departamento: "Grandes contas",
    image: hallan
  },
  {
    nome: "Argemiro Bezerra Junior",
    cargo: "Solutions Architect - Pre Sales/ Engineer",
    tel: "+55 11 91612-8898",
    email: "argemiro.junior@tecnocomp.com.br",
    site: "www.tecnocomp.com.br",
    portfolio: "www.tecnocomp.com.br/portfiolio",
    departamento: "Govtech",
    image: argemiro
  },
  {
    nome: "André de Souza Silva",
    cargo: "Product Manager/Solutions Architect - Pre-Sales",
    tel: "+55 11 98680-8431",
    email: "andre.silva@tecnocomp.com.br",
    site: "www.tecnocomp.com.br",
    portfolio: "www.tecnocomp.com.br/portfiolio",
    departamento: "Govtech",
    image: andre
  },
  {
    nome: "Marcos Vinicius S. Revite",
    cargo: "Solutions Architect - Pre-Sales",
    tel: "+55 11 98655-3055",
    email: "marcos.revite@tecnocomp.com.br",
    site: "www.tecnocomp.com.br",
    portfolio: "www.tecnocomp.com.br/portfiolio",
    departamento: "Govtech",
    image: marcos
  },
  {
    nome: "Josimar Caitano",
    cargo: "Solutions Architect - Post-Sales",
    tel: "+55 11 99675-3089",
    email: "josimar.caitano@tecnocomp.com.br",
    site: "www.tecnocomp.com.br",
    portfolio: "www.tecnocomp.com.br/portfiolio",
    departamento: "Govtech",
    image: josimar
  },
  {
    nome: "Natalia Leal",
    cargo: "Project Manager - Gov",
    tel: "+55 11 99398-5479",
    email: "natalia.leal@tecnocomp.com.br",
    site: "www.tecnocomp.com.br",
    portfolio: "www.tecnocomp.com.br/portfiolio",
    departamento: "Govtech",
    image: natalia
  },
  {
    nome: "Ana Carolina Sartori Carvalho",
    cargo: "BackOffice Analyst - Gov",
    tel: "+55 11 96152-2980",
    email: "ana.carvalho@tecnocomp.com.br",
    site: "www.tecnocomp.com.br",
    portfolio: "www.tecnocomp.com.br/portfiolio",
    departamento: "Govtech",
    image: anna
  }
];
