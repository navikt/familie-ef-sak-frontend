FROM navikt/node-express:12.2.0-alpine
RUN apk --no-cache add curl

ARG GIT_BRANCH_NAME
ARG GIT_COMMIT_DATE
ENV GIT_BRANCH_NAME=$GIT_BRANCH_NAME
ENV GIT_COMMIT_DATE=$GIT_COMMIT_DATE

ADD ./ /var/server/

CMD ["yarn", "start"]