# HORUS - OSINT cyber-news ingestion and processing pipeline

HORUS is an end-to-end OSINT cyber-news ingestion and processing pipeline developed for Skill & Reach. It includes ingestion (RSS + headless scraping), LLM-based enrichment (classification, tagging, automatic summaries), vector embedding-based deduplication and related-article detection, and an Elasticsearch-backed API with a React control center for exploration and scheduled email reports. The system is containerized and supports per-source configuration, structured logging, and authentication.

- [HORUS - OSINT cyber-news ingestion and processing pipeline](#horus---osint-cyber-news-ingestion-and-processing-pipeline)
  - [Setup](#setup)
    - [Prerequisites](#prerequisites)
    - [Run the stack](#run-the-stack)
    - [Check in the Control Center UI](#check-in-the-control-center-ui)
  - [Useful commands](#useful-commands)
    - [Docker commands](#docker-commands)
    - [Verify data](#verify-data)
    - [Deleting documents](#deleting-documents)
  - [Data](#data)
    - [Articles](#articles)
    - [Sources](#sources)
    - [Users](#users)
  - [API](#api)
  - [Control Center UI](#control-center-ui)
  - [Pipeline](#pipeline)
    - [Code layout](#code-layout)
    - [Environment variables](#environment-variables)
    - [Logging](#logging)

## Setup

### Prerequisites

- Docker and Docker Compose installed (Docker Desktop with WSL integration or Docker on Linux).
- WSL2 (if running from Windows) or a Linux shell.

### Run the stack

From the repository root in a bash shell:

```bash
# Build the images
docker compose build

# Start the services
docker compose up -d
```

This will build and start Elasticsearch, the pipeline worker, the API, and the Control Center UI as defined in `compose.yml`.

### Check in the Control Center UI

Open the UI in your browser: `http://localhost:5173/`

## Useful commands

### Docker commands

```bash
# Stop the stack
docker compose down

# View logs
docker compose logs -f

# Rebuild and restart the stack
docker compose up -d --build

# Restart the stack
docker compose restart
```

### Verify data

```bash
# Check document count
curl -s 'http://localhost:9200/news/_count?pretty'

# View stored documents
curl -s 'http://localhost:9200/news/_search?pretty'

# View a document by ID
curl -s 'http://localhost:9200/news/_doc/<DOCUMENT_ID>?pretty'
```

### Deleting documents

```bash
# Delete a document by ID
curl -X DELETE 'http://localhost:9200/news/_doc/<DOCUMENT_ID>'

# Delete all documents
curl -X DELETE 'http://localhost:9200/news'
```

## Data

### Articles

Indexed document model stored in Elasticsearch `news` index.

- `_id` (string): hash representation of the `url`
- `title` (string): article title
- `url` (string): article URL
- `feed_url` (string): original feed URL
- `source` (string): feed site title
- `source_url` (string): feed site URL
- `abstract` (string): LLM generated summary of the article's content
- `content` (string): article page html content
- `tags` (List[string]): LLM generated keywords
- `sectors` (List[string]): LLM selected keywords from predefined list (Advocacia, Ambiente, Comércio, Construção, Consulturia, Educação, Energia, Entretenimento, Finanças, Indústria, Logística, Media, Público, Saúde, Seguros, Tecnologia, Telecomunicações, Transportes, Turismo) (Law, Environment, Trade, Construction, Consulting, Education, Energy, Entertainment, Finance, Manufacturing, Logistics, Media, Public Sector, Health, Insurance, Technology, Telecommunications, Transportation, Tourism)
- `categories` (List[string]): keywords listed in article RSS feed
- `criticality` (string): LLM selected level based on a predefined list (low, medium, high, critical)
- `published_at` (Date): date in ISO8601 format
- `published_at_raw` (string): original date string
- `language` (string): language (e.g. 'en-US', 'pt-PT')
- `confidence` (int): predefined source confidence score level (0-5), defined by the `source` confidence value
- `ingested_at` (Date): ingestion timestamp in ISO8601 format (currently empty)
- `offer` (string | null): LLM selected string with Skill & Reach offer (Consultoria NIS 2, Consultoria DORA, Consultoria Continuidade de Negócio, CISO as a Service, Formação, Cyber Threat Intelligence, Gestão de Ciber Riscos) (NIS 2 Consulting, DORA Consulting, Business Continuity Consulting, CISO as a Service, Training, Cyber Threat Intelligence, Cyber Risk Management)
- `estimated_read_time` (string | null): Human-friendly reading time estimate (e.g., `"4 min read"`) computed with the [`readtime`](https://pypi.org/project/readtime/) package. Values longer than ~20 minutes are discarded.
- `embedding` (List[float] | null): vector embedding computed from title + abstract for deduplication and similarity search.

### Sources

Model stored in the SQLite database `app.db` (table `sources`).
Managed via the API (endpoints under `/sources`) or the Control Center UI (`http://localhost:5173`).

- `id` (number): internal identifier of the source.
- `name` (string | null): optional, human-friendly display name for the source.
- `url` (string): feed/site URL of the source.
- `input_type` (string): input type; currently supported: `rss`.
- `confidence` (number): predefined confidence score (0–5) used to hint quality/priority.
- `enabled` (boolean): whether the source is active for ingestion.
- `last_status` (string | null): status/message from the last check/ingestion attempt for this source (e.g., success/error/description).
- `last_checked_at` (string | null): ISO8601 timestamp when the pipeline last checked this source.
- `created_at` (string): ISO8601 timestamp when the source record was created.
- `updated_at` (string): ISO8601 timestamp when the source record was last modified.

### Users

Model stored in the SQLite database `app.db` (table `users`).
Managed via the API (endpoints under `/admin/users`) or the Control Center UI (`http://localhost:5173`) (needs admin credentials).

- `id` (number): internal identifier of the user.
- `email` (string): unique email address of the user (used to log in).
- `role` (string): user role (`user`, `admin`).
- `password_hash` (string): bcrypt password hash.
- `created_at` (string): ISO8601 timestamp when the user was created.
- `updated_at` (string): ISO8601 timestamp when the user record was last modified.

## API

TBA

## Control Center UI

TBA

## Pipeline

### Code layout

Under `apps/pipeline/`:

- `runner/` - `__main__.py` orchestrates the end-to-end cycle (ingest -> process -> store).
- `ingest/` - Acquisition bits, e.g. `rss.py` (normalize RSS/Atom entries) and `source_providers.py` (Env/API providers).
- `process/` - Transformation steps, currently `sanitize.py` with placeholders for future classify/tag/sectors stages.
- `store/` - Persistence clients such as `es_client.py` for Elasticsearch bulk indexing.
- `shared/` - Cross-cutting helpers: `config.py`, `logging_conf.py`, `date_utils.py`, and shared dataclasses in `models.py`.
- `deliver/` - Placeholder for outbound channels (e.g. email) to come next.

### Environment variables

You can set these in `compose.yml`.

- `ES_HOST` (default: `http://elasticsearch:9200`)
- `ES_INDEX` (default: `news`)
- `INTERVAL_MINUTES` (default: `10`) - Interval for the scheduler between cycles
- `FEEDS` (optional) - Comma-separated list of RSS/Atom URLs (used when `SOURCES_PROVIDER=env`)
- `SOURCES_PROVIDER` (default: `env`) - `env` uses `FEEDS`; `api` fetches from the Sources API with fallback to `FEEDS` if the API is unavailable.
- `SOURCES_API_BASE` (default: not set) - Base URL for the Sources API (`http://api:8000` inside Docker).
- `SOURCES_API_TIMEOUT_SEC` (default: `10`) - HTTP timeout (in seconds) for calls to the Sources API.
- `RUN_ONCE` (optional: `true|false`, default: `false`) - When `true`, run a single cycle and exit
- `LOG_LEVEL` (default: `INFO`) - Logging verbosity level. Options are `INFO`, `DEBUG`.
- `BULK_MAX_DOCS` (default: `500`) - Bulk chunk size
- `HTTP_TIMEOUT_SEC` (default: `30`)
- `MAX_ATTEMPTS` (default: `5`)

### Logging

The pipeline emits per-feed and per-cycle summaries:

- Per feed: `Feed summary: <url> | processed=<N>, added=<A>, repeated=<R>, errors=<E>`
- Per cycle: `Cycle summary: cycle | processed=<N>, added=<A>, repeated=<R>, errors=<E>`

At `LOG_LEVEL=DEBUG`, it also lists the actual URLs:

- `Processed URLs (N): <url1>, <url2>, ...`
- `Added URLs (A): <urlX>, ...`
- `Repeated URLs (R): <urlY>, ...`
