import type { Locale } from '@/i18n/config'

export const profile = {
  name: 'Gustavo Santana',
  fullName: 'Gustavo de Santana Barbosa',
  email: 'gustavosantana559@gmail.com',
  // TODO(gustavo): false esconde o status "aberto a oportunidades" do header.
  available: true,
  links: {
    github: 'https://github.com/gustavosantana-034',
    linkedin: 'https://www.linkedin.com/in/gustavo-de-santana-barbosa/',
    certificates: 'https://github.com/gustavosantana-034/Certifications-',
  },
  /**
   * Résumé per locale, served from public/resume/.
   * Enquanto um arquivo não existir, o botão daquele idioma fica escondido no
   * build de produção (no `npm run dev` ele aparece marcado como ausente).
   */
  resume: {
    'pt-BR': '/resume/resume-gustavo-santana-pt-br.pdf',
    en: '/resume/resume-gustavo-santana-en.pdf',
  } satisfies Record<Locale, string>,
}
