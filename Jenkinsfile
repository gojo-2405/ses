pipeline {
    agent any

    environment {
        APP_NAME = "ses-contact-app"
        IMAGE_NAME = "ses-app"
        TAG_NAME = "v1.0.${BUILD_NUMBER}"
    }

    stages {
        stage('Build Docker Image') {
            steps {
                sh '''
                docker build -t ${IMAGE_NAME}:${TAG_NAME} .
                '''
            }
        }

        stage('Deploy Container') {
            steps {
                sh '''
                docker stop ${APP_NAME} || true
                docker rm ${APP_NAME} || true

                docker run -d \
                  --name ${APP_NAME} \
                  -p 3000:3000 \
                  --env-file .env \
                  ${IMAGE_NAME}:${TAG_NAME}
                '''
            }
        }

        stage('Create Git Tag After Success') {
            steps {
                withCredentials([
                    usernamePassword(
                        credentialsId: 'github-creds',
                        usernameVariable: 'GIT_USER',
                        passwordVariable: 'GIT_TOKEN'
                    )
                ]) {
                    sh '''
                    git config user.name "$GIT_USER"
                    git config user.email "$GIT_USER@users.noreply.github.com"

                    git tag -a ${TAG_NAME} -m "Successful deployment ${TAG_NAME}"

                    git push origin ${TAG_NAME}
                    '''
                }
            }
        }
    }

    post {
        success {
            echo "Deployment successful. Git tag created: ${TAG_NAME}"
        }

        failure {
            echo "Build or deployment failed. Git tag was not created."
        }
    }
}
