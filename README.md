# ♻️ EcoRota

![Status](https://img.shields.io/badge/STATUS-CONCLUÍDO-brightgreen?style=for-the-badge)
![Node](https://img.shields.io/badge/Node.js-43853D?style=for-the-badge&logo=node.js&logoColor=white)
![Express](https://img.shields.io/badge/Express.js-404D59?style=for-the-badge)
![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white)
![React](https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)
![Docker](https://img.shields.io/badge/Docker-2496ED?style=for-the-badge&logo=docker&logoColor=white)
![Prisma](https://img.shields.io/badge/Prisma-3982CE?style=for-the-badge&logo=Prisma&logoColor=white)

## 🌍 Objetivo do Sistema

O **EcoRota** é uma plataforma inovadora desenvolvida para transformar a gestão e o acesso à coleta seletiva de resíduos. Nosso objetivo é **empoderar a comunidade** com informações claras e acessíveis, conectando cidadãos aos pontos de coleta e parceiros de reciclagem.

Através de uma interface intuitiva e um sistema robusto, visamos:
*   📍 **Facilitar a localização** de ecopontos e rotas de coleta.
*   🤝 **Conectar parceiros** e empresas de reciclagem aos cidadãos.
*   📢 **Permitir o reporte** ágil de problemas relacionados à limpeza urbana.
*   🌿 **Promover a sustentabilidade** incentivando o descarte correto.

---

## 🏗️ Arquitetura Back-End

O núcleo do sistema foi construído sobre os pilares da **Clean Architecture** (Arquitetura Limpa), garantindo um código desacoplado, testável e escalável.

### 🚀 Stack Tecnológica
*   **Node.js & Express**: Framework web rápido e minimalista para a API RESTful.
*   **TypeScript**: Tipagem estática para maior segurança e produtividade.
*   **Prisma ORM**: Gerenciamento de banco de dados moderno e type-safe.
*   **MySQL**: Banco de dados relacional confiável.
*   **Jest**: Framework de testes para garantir a qualidade do código.
*   **Zod**: Validação de esquemas e dados de entrada.

### 🧩 Camadas do Sistema

A aplicação é modularizada em quatro camadas concêntricas. 
> 💡 **Nota**: Para demonstrar a arquitetura, utilizaremos o módulo de **Ecopoint** (Ecoponto) como exemplo em todas as camadas abaixo.

<details>
<summary><strong>📂 1. Domain (Domínio)</strong> - Clique para expandir</summary>

A camada mais interna. Aqui residem as **Entidades** e regras de negócio puras. Ela desconhece banco de dados ou interfaces web.

*   **Exemplo (`Ecopoint.ts`)**: Define a estrutura central de um Ecoponto, utilizando Value Objects para validação (como `GeoLocation` e `AcceptedMaterials`).

```typescript
// backend/src/domain/entities/Ecopoint.ts
export class Ecopoint {
    constructor(
        public readonly id: number,
        public name: string,
        // Value Objects encapsulam regras de validação complexas
        public acceptedMaterials: AcceptedMaterials,
        public geoLocation: GeoLocation,
        // ...
        public readonly createdAt: Date
    ) { }
}
```
</details>

<details>
<summary><strong>⚙️ 2. Application (Aplicação)</strong> - Clique para expandir</summary>

Orquestra os **Casos de Uso** (Use Cases). É aqui que a "mágica" acontece: buscar dados, aplicar regras e devolver resultados.

*   **Exemplo (`CreateEcopointUseCase.ts`)**: Recebe dados brutos, converte para entidades de domínio e persiste através de repositórios.

```typescript
// backend/src/application/use-cases/ecopoint/CreateEcopointUseCase.ts
export class CreateEcopointUseCase {
  constructor(private ecopointRepository: EcopointRepository) { }

  async execute(input: CreateEcopointInputDTO): Promise<CreateEcopointOutputDTO> {
    // Converte DTO para Value Objects
    const geoLocation = new GeoLocation(input.latitude, input.longitude);
    
    // Chama o repositório (Interface) para salvar
    const ecopoint = await this.ecopointRepository.create({
      name: input.name,
      geoLocation,
      // ...
    });
    
    return this.mapToOutput(ecopoint);
  }
}
```
</details>

<details>
<summary><strong>🧱 3. Infrastructure (Infraestrutura)</strong> - Clique para expandir</summary>

Implementa as interfaces definidas nas camadas superiores. Aqui reside a comunicação com o Banco de Dados, APIs externas, etc.

*   **Tecnologia**: Utilizamos **Prisma ORM** pela sua segurança de tipos e facilidade de migração.
*   **Repositórios**: O `PrismaEcopointRepository` traduz as chamadas do domínio para queries do banco de dados.
</details>

<details>
<summary><strong>🔌 4. Presentation (Apresentação)</strong> - Clique para expandir</summary>

O ponto de entrada. Recebe requisições HTTP (Express), valida a entrada (Zod) e delega para os casos de uso.

*   **Exemplo (`EcopointController.ts`)**:

```typescript
// backend/src/presentation/controllers/EcopointController.ts
export class EcopointController {
    async create(req: Request, res: Response) {
        // Validação de entrada com Zod
        const data = createEcopointSchema.parse(req.body);
        
        // Execução do caso de uso
        const output = await this.createEcopointUseCase.execute({ ...data });

        return res.status(201).json(output);
    }
}
```
</details>

---

## 💻 Arquitetura Front-End

Nosso Front-End é uma **Single Page Application (SPA)** moderna, rápida e responsiva.

### 🚀 Stack Tecnológica
*   **Vite**: Build tool de próxima geração, garantindo desenvolvimento ultra-rápido.
*   **React + TypeScript**: Para interfaces componentizadas e type-safe.
*   **Bootstrap 5**: Estilização robusta e responsiva.
*   **Axios**: Cliente HTTP para comunicação com o Back-End.

### 📂 Estrutura do Projeto

A organização de pastas favorece a escalabilidade e manutenção:

```bash
frontend/src/
├── components/       # Componentes Reutilizáveis
│   ├── common/       # Botões, Inputs, Cards genéricos
│   ├── ecopontos/    # Componentes específicos de Ecopontos
│   │   ├── PartnerCard.tsx     # Card de exibição de parceiros
│   │   ├── EcopointSearch.tsx  # Busca complexa com filtros
│   │   └── ...
├── pages/            # Páginas da aplicação (Rotas)
│   ├── Home.tsx      # Landing Page
│   ├── Ecopontos.tsx # Listagem e Busca
│   └── ...
├── services/         # Camada de Integração com API
│   ├── api.ts              # Configuração do Axios
│   └── ecopointService.ts  # Métodos: list, create, findById
└── context/          # Gerenciamento de Estado Global (Auth, etc)
```

### 🌟 Destaques da Implementação

1.  **Integração com API (`services/`)**:
    Centralizamos todas as chamadas HTTP em serviços dedicados. Isso facilita a manutenção e tratamento de erros.
    ```typescript
    // frontend/src/services/ecopointService.ts
    export const ecopointService = {
        list: async (params?: EcopointFilter) => {
            const response = await api.get('/ecopoints', { params });
            return response.data;
        }
    };
    ```

2.  **Páginas Inteligentes (`pages/Ecopontos.tsx`)**:
    As páginas gerenciam o estado da aplicação e consomem os serviços. O componente `Ecopontos` carrega os dados ao montar, trata estados de carregamento (`loading`) e renderiza os componentes de apresentação.

---

## 🐳 Containerização (Docker)

Garantimos que a aplicação rode exatamente igual em qualquer máquina. O projeto é orquestrado via `docker-compose`.

**Serviços:**
1.  **Database**: MySQL 8.
2.  **Backend**: Node.js API (Porta 3001).
3.  **Frontend**: Servidor web (Porta 3000).

### Como Rodar o Projeto

Utilize os comandos abaixo para configurar o ambiente.

**1. Clone o repositório:**
```bash
git clone https://github.com/SeuUsuario/EcoRota-PI_IV.git
```

**2. Suba os containers:**
```bash
docker-compose up --build
```

---

## 🧪 Testes

A qualidade e estabilidade do código são prioridades no EcoRota. Implementamos uma estratégia de testes robusta utilizando o framework **Jest**, cobrindo desde regras de negócio isoladas até o comportamento integral da API.

### Testes Unitários
Estes testes focam na validação das camadas de **Domínio** e **Aplicação**. Eles são executados rapidamente pois não dependem de infraestrutura externa (como banco de dados). Garantem que as entidades, Value Objects e Casos de Uso funcionem conforme esperado em isolamento.

Para executar os testes unitários:
```bash
npm run test:unit
```

### Testes de Integração
Estes testes verificam a comunicação entre as camadas e a persisitência de dados. Eles sobem um ambiente controlado (banco de dados de teste ou em memória) para garantir que a **API Node.js/Express** receba requisições, processe através do Prisma ORM e retorne as respostas corretas.

Para executar os testes de integração:
```bash
npm run test:integration
```
