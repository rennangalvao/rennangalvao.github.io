export const EMPRESA = {
  nome: "G-TECH SYSTEMS",
  razao: "G-TECH AUTOMACAO E SISTEMAS LTDA",
  cnpj: "68.816.887/0001-24",
  cidade: "Palmas/TO",
  atendimento: "Presencial em Palmas e no Tocantins · remoto em todo o Brasil",
};

const FONE = "5563981212444";
export const waLink = (msg) => `https://wa.me/${FONE}?text=${encodeURIComponent(msg)}`;

export const CONTATO = {
  whatsapp: "(63) 98121-2444",
  whatsappLink: waLink("Olá, G-TECH! Vim pelo site e quero um orçamento."),
  email: "gtech.instrumentacao@gmail.com",
  emailLink: "mailto:gtech.instrumentacao@gmail.com?subject=" + encodeURIComponent("Orçamento pelo site"),
};

export const AMBIENTES = [
  { titulo: "Indústria", itens: ["Instrumentação e calibração", "CLP e painéis de comando", "Monitoramento de processo"] },
  { titulo: "Subestações", itens: ["Supervisão e alarmes", "Coleta de medições", "Relatórios automáticos"] },
  { titulo: "Escritórios", itens: ["Sistemas sob medida", "Rotinas automatizadas", "Atendimento por WhatsApp"] },
  { titulo: "Casas", itens: ["Automação residencial", "Câmeras e sensores", "Controle pelo celular"] },
];

export const SERVICOS = [
  { titulo: "Instrumentação e automação industrial", texto: "Instalação, calibração e integração de instrumentos, CLPs e painéis para o processo rodar sem surpresa." },
  { titulo: "Software sob encomenda", texto: "Sistemas, painéis e aplicativos feitos para o jeito que a sua empresa trabalha." },
  { titulo: "Automação com IA", texto: "Robôs de WhatsApp e Telegram e fluxos no n8n que respondem, avisam e organizam sozinhos." },
  { titulo: "Sites e páginas de venda", texto: "Sites rápidos, que aparecem no Google e levam o cliente direto para o seu contato." },
];

export const PROJETOS = [
  { titulo: "Agenda online de barbearia", texto: "O cliente marca o horário pelo site e o pedido chega na hora no WhatsApp do barbeiro." },
  { titulo: "Delivery atendido por IA", texto: "Robô no WhatsApp que mostra o cardápio, responde dúvidas e calcula a taxa de entrega pela localização." },
  { titulo: "Pagamentos via PIX automatizados", texto: "Sistema que recebe, confere e registra cada pagamento sem trabalho manual." },
  { titulo: "Canal de vídeos que se produz sozinho", texto: "Roteiro, narração, edição e publicação diária feitos por IA. É o G-Tech Curioso, logo abaixo." },
];

export const CANAL = {
  nome: "G-Tech Curioso",
  url: "https://www.youtube.com/@gtechcurioso",
  inscrever: "https://www.youtube.com/@gtechcurioso?sub_confirmation=1",
  channelId: "UC9NiI-ewQ-U4XrKaqHIH26Q",
};
