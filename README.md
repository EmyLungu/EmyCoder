# EmyCoder: Language Prediction & Execution API

EmyCoder is a high-performance FastAPI application that uses machine learning to identify the programming language of a code snippet and executes it within isolated environment.

## 🚀 Key Features

* **Language Detection:** Uses an incrementally trained `scikit-learn` model to identify code languages.
* **Version Control:** Users can toggle between different iterations of the ML model.
* **Secure Execution:** Code snippets are executed inside isolated **Docker containers** to ensure host safety.
* **Custom Dataset:** Trained on a unique dataset scraped from GitHub and stored in **MongoDB**.
* **RESTful API:** Clean and documented endpoints powered by FastAPI.

## 🏗️ Architecture

1.  **Ingestion:** Code snippets are received via POST requests.
2.  **Classification:** The snippet is passed to a specific version of a pre-trained `sklearn` classifier.
3.  **Isolation:** If execution is requested, the code is mounted into a transient Docker container.
4.  **Reporting:** Output (stdout/stderr) and the predicted language are returned to the user.

## 🛠️ Tech Stack

* **Framework:** [FastAPI](https://fastapi.tiangolo.com/)
* **ML Library:** [scikit-learn](https://scikit-learn.org/) (Incremental learning using `SGDClassifier` and `partial_fit`)
* **Database:** [MongoDB](https://www.mongodb.com/) (Training data storage)
* **Containerization:** [Docker](https://www.docker.com/) (Snippet isolation)
* **Language:** Python 3.14-slim

## 📥 Getting Started

### Prerequisites
- Docker installed and running
- The `FastAPI` and the `MongoDB` instances are hosted in Docker containers.

### Installation
###### (Future automatization will cover most of it)
1. Clone the repo `git@github.com:EmyLungu/EmyCoder.git`
- Setup the `.env`
- Start the MongoDB container `db/docker-compose.yml` and `db/initalizer.py`
2. Run the `scraper/main.py`
3. Load the data from the db to a `.parquet` file using the `trainer/loader.py`
- Train using `trainer/train_sgdc.ipynb`
- Move the trained model to `app/src/model/models/`
- Start FastAPi `docker-compose.yml`