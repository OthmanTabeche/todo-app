# Frontend — Aplicació TodoMVC

Aplicació de gestió de tasques (TodoMVC) construïda amb React i TypeScript, connectada a un backend serverless d'AWS (Lambda + API Gateway + DynamoDB).

---

## Tecnologies

| Tecnologia | Rol |
|------------|-----|
| React 18 | Llibreria d'interfície |
| TypeScript | Tipat estàtic |
| Vite | Bundler i servidor de desenvolupament |
| AWS Lambda + API Gateway | Backend serverless |
| DynamoDB | Base de dades al núvol |

---

## Estructura del projecte

```
todo-app/
├── .env                        # Variables d'entorn locals
├── .env.example                # Plantilla de variables d'entorn
├── index.html
├── package.json
├── tsconfig.json
├── vite.config.ts
└── src/
    ├── App.tsx                 # Component arrel, renderitza Header, Todos i Footer
    ├── consts.ts               # Valors constants (filtres: ALL, ACTIVE, COMPLETED)
    ├── types.d.ts              # Tipus TypeScript (Todo, FilterValue, TodoList)
    ├── vite-env.d.ts           # Tipat de les variables d'entorn de Vite
    ├── components/
    │   ├── Header.tsx          # Camp d'entrada per crear tasques
    │   ├── Todos.tsx           # Llista de tasques
    │   ├── Todo.tsx            # Component d'una tasca individual
    │   └── Filters.tsx         # Botons de filtre (All / Active / Completed)
    ├── hooks/
    │   └── useTodos.ts         # Lògica principal: estat + crides a l'API
    ├── services/
    │   └── todos.ts            # Funcions fetch cap a l'API d'AWS
    └── mocks/
        └── todos.ts            # Dades de mostra (no s'usen en producció)
```

---

## Configuració del fitxer `.env`

Abans d'arrancar l'aplicació cal crear el fitxer `.env` a l'arrel del projecte:

```bash
cp .env.example .env
```

Edita `.env` amb els valors reals:

```env
VITE_API_URL=https://2sjltqm4mk.execute-api.us-east-1.amazonaws.com/dev
VITE_USER_ID=user-1
```

| Variable | Descripció |
|----------|------------|
| `VITE_API_URL` | URL base de l'API Gateway desplegada amb Terraform |
| `VITE_USER_ID` | Identificador d'usuari fix (no hi ha autenticació) |

> El fitxer `.env` està al `.gitignore` i no es puja al repositori.

---

## Com arrancar el servidor de desenvolupament

```bash
# Instal·lar dependències (només la primera vegada)
npm install

# Arrancar el servidor
npm run dev
```

L'aplicació estarà disponible a: **http://localhost:5173**

Per aturar el servidor: `Ctrl + C`

### Altres comandes

```bash
# Compilar per a producció
npm run build

# Previsualitzar la build de producció
npm run preview

# Verificar errors de TypeScript
npx tsc --noEmit
```

---

## Com usar l'aplicació

### Afegir una tasca

1. Fes clic al camp d'entrada de la part superior (amb el placeholder *"¿Qué quieres hacer?"*)
2. Escriu el títol de la tasca
3. Prem **Enter**

La tasca es guarda automàticament a DynamoDB via l'API.

### Marcar una tasca com a completada

Fes clic al **cercle** que hi ha a l'esquerra del títol de la tasca. Es posarà de color verd i el text quedarà ratllat.

Per desmarcar-la, fes clic al cercle de nou.

### Editar el títol d'una tasca

Fes **doble clic** sobre el títol de la tasca. Apareixerà un camp d'edició.

- Prem **Enter** per guardar els canvis
- Prem **Escape** per cancel·lar l'edició

### Eliminar una tasca

Passa el ratolí per sobre d'una tasca i fes clic a la **X** que apareix a la dreta.

### Filtrar tasques

A la part inferior hi ha tres botons de filtre:

| Filtre | Descripció |
|--------|------------|
| **All** | Mostra totes les tasques |
| **Active** | Mostra només les tasques pendents |
| **Completed** | Mostra només les tasques completades |

El filtre seleccionat es desa a la URL (`?filter=active`), de manera que pots compartir l'enllaç o refrescar la pàgina sense perdre'l.

### Esborrar totes les completades

Si hi ha tasques completades, apareix el botó **"Clear completed"** a la part inferior dreta. Fes clic per eliminar-les totes d'un cop (s'eliminen en paral·lel a DynamoDB).