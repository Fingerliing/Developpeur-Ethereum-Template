# Voting Contract Tests

Ce dépôt contient des tests unitaires pour le contrat Voting, qui est un contrat de vote basé sur la blockchain.

## Structure des tests

Les tests sont écrits en utilisant le framework de test Truffle et la bibliothèque de tests OpenZeppelin. Les fichiers de test sont situés dans le dossier `test`.

Les tests sont organisés en sections correspondant aux différentes fonctionnalités du contrat Voting. Chaque section contient plusieurs cas de test pour vérifier le bon fonctionnement du contrat.

## Tests réalisés

### Déploiement du contrat

- `should deploy the contract with the correct owner`: Vérifie que le contrat est déployé avec le bon propriétaire.
- `should have the initial workflow status as 'RegisteringVoters'`: Vérifie que le statut initial du workflow est "RegisteringVoters".
- `should emit the WorkflowStatusChange event when deploying`: Vérifie que l'événement WorkflowStatusChange est émis lors du déploiement du contrat.

### Gestion des voteurs

- `should register a voter`: Vérifie que l'ajout d'un voteur est effectué avec succès.
- `should revert when registering the same voter twice`: Vérifie que l'ajout du même voteur deux fois est rejeté.
- `should get the voter's address`: Vérifie que l'adresse du voteur est récupérée correctement.

### Gestion du statut du workflow

- `should set the initial workflow status correctly`: Vérifie que le statut initial du workflow est correct.
- `should allow the owner to change the workflow status`: Vérifie que le propriétaire peut modifier le statut du workflow avec succès.
- `should revert when a non-owner tries to change the workflow status`: Vérifie que la modification du statut du workflow par un non-propriétaire est rejetée.

### Gestion des propositions

- `should allow adding a proposal`: Vérifie que l'ajout d'une proposition est effectué avec succès.
- `should revert when adding an empty proposal`: Vérifie que l'ajout d'une proposition vide est rejeté.
- `should revert when adding a proposal before the proposal registration phase`: Vérifie que l'ajout d'une proposition avant la phase d'enregistrement des propositions est rejeté.

### Votes

- `should allow a registered voter to cast a vote`: Vérifie qu'un voteur enregistré peut émettre un vote avec succès.
- `should revert when a non-voter tries to cast a vote`: Vérifie que l'émission d'un vote par un non-voteur est rejetée.
- `should revert when casting a vote before the voting phase`: Vérifie que l'émission d'un vote avant la phase de vote est rejetée.

### Décompte des votes

- `should tally the votes correctly`: Vérifie que le décompte des votes est effectué correctement.
- `should set the winning proposal ID correctly`: Vérifie que l'ID de la proposition gagnante est défini correctement.

## Exécution des tests

Assurez-vous d'avoir installé Truffle et d'avoir un environnement de développement Ethereum local ou un réseau de test configuré.

1. Déployez le contrat Voting en exécutant `truffle migrate` dans votre terminal.
2. Exécutez les tests en exécutant `truffle test` dans votre terminal.