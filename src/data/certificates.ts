/**
 * Courses with a verifiable certificate, from
 * github.com/gustavosantana-034/Certifications-. Titles stay as issued.
 * Ordered by relevance to backend work, not by date.
 */

const repo = 'https://github.com/gustavosantana-034/Certifications-'

export interface Certificate {
  id: string
  title: string
  issuer: string
  instructor?: string
  url: string
  skills: string[]
}

export const certificatesRepo = repo

export const certificates: Certificate[] = [
  {
    id: 'aws-serverless',
    title: 'Masterclass aplicações serverless na AWS',
    issuer: 'Erick Wendel Cursos',
    instructor: 'Erick Wendel',
    url: `${repo}/blob/main/assets/certificate.pdf`,
    skills: ['AWS', 'Serverless', 'Back-end architecture', 'OOP'],
  },
  {
    id: 'js-ts-complete',
    title: 'Curso completo de JavaScript e TypeScript',
    issuer: 'Udemy',
    instructor: 'Otávio Miranda',
    url: 'https://www.udemy.com/certificate/UC-59ed0da3-8581-4294-bc01-b99d892902e7/',
    skills: ['JavaScript', 'TypeScript', 'OOP', 'React', 'Databases'],
  },
  {
    id: 'js-full-stack',
    title: 'JavaScript Fundamentals to Advanced: Full Stack Development',
    issuer: 'Udemy',
    url: 'https://www.udemy.com/certificate/UC-a1b0c65d-2927-4834-9cfe-3b4b6af8ba93/',
    skills: ['Advanced JavaScript', 'Backend', 'Databases', 'Full stack architecture'],
  },
  {
    id: 'js-10-projects',
    title: 'Learn JavaScript by Creating 10 Practical Projects',
    issuer: 'Udemy',
    url: 'https://www.udemy.com/certificate/UC-ec325261-9a62-4633-bd5c-5542fb8dd52a/',
    skills: ['DOM', 'Events', 'API integration'],
  },
  {
    id: 'css-js',
    title: 'CSS And JavaScript Complete Course For Beginners',
    issuer: 'Udemy',
    url: 'https://www.udemy.com/certificate/UC-b09129c8-5d7d-4512-bece-6479868a3c9a/',
    skills: ['CSS3', 'JavaScript', 'Responsive design'],
  },
  {
    id: 'python-3',
    title: 'Learn Python 3',
    issuer: 'Codecademy',
    url: 'https://www.codecademy.com/profiles/darkpwd/certificates/6c152bd262967f8c941c9707ed636bda',
    skills: ['Python', 'Data structures', 'File I/O', 'OOP'],
  },
  {
    // TODO(gustavo): no README do repositório este curso aparece como Udemy,
    // mas o link aponta para o mesmo certificado do Learn Python 3. Confira.
    id: 'connect-four',
    title: 'Build Connect Four Using Python',
    issuer: 'Codecademy',
    url: 'https://www.codecademy.com/profiles/darkpwd/certificates/6c152bd262967f8c941c9707ed636bda',
    skills: ['Python', 'Game logic', 'Algorithms'],
  },
]
