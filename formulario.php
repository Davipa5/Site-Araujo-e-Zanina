<?php
use PHPMailer\PHPMailer\PHPMailer;
use PHPMailer\PHPMailer\Exception;

require 'PHPMailer/src/Exception.php';
require 'PHPMailer/src/PHPMailer.php';
require 'PHPMailer/src/SMTP.php';

// Verifica se o formulário foi enviado
if ($_SERVER["REQUEST_METHOD"] === "POST") {
    // Captura e sanitiza os dados do formulário
    $nome = htmlspecialchars(trim($_POST['nome']));
    $telefone = htmlspecialchars(trim($_POST['telefone']));
    $email = htmlspecialchars(trim($_POST['email']));
    $mensagem = htmlspecialchars(trim($_POST['mensagem']));
    $area = htmlspecialchars(trim($_POST['area'])); // Captura a área de atuação

    // Verifica se todos os campos foram preenchidos
    if (empty($nome) || empty($telefone) || empty($email) || empty($mensagem) || empty($area)) {
        echo "<script>
                alert('Por favor, preencha todos os campos.');
                window.history.back();
              </script>";
        exit;
    }

    $mail = new PHPMailer(true);

    try {
        // Configurações do servidor SMTP da HostGator
        $mail->isSMTP();
        $mail->Host = 'e-mail do host'; // Servidor SMTP da HostGator
        $mail->SMTPAuth = true; // Autenticação habilitada
        $mail->Username = 'e-mail'; // E-mail completo
        $mail->Password = 'Senha'; // Senha do e-mail
        $mail->SMTPSecure = PHPMailer::ENCRYPTION_STARTTLS; // TLS ou SSL conforme necessário
        $mail->Port = 587; // Porta do servidor SMTP (587 para TLS, 465 para SSL)

        // Nome válido para o HELO
        $mail->Helo = 'dominio-site';

        // Remetente e destinatário
        $mail->setFrom('e-mail', 'E-mail'); // E-mail do remetente
        $mail->addAddress('e-mail', 'E-mail'); // E-mail do destinatário

        // Conteúdo do e-mail
        $mail->isHTML(true);
        $mail->Subject = 'Novo Contato - Formulário de Contato';
        $mail->Body = "
            <h1>Nova Mensagem de Contato</h1>
            <p><strong>Nome:</strong> $nome</p>
            <p><strong>Telefone:</strong> $telefone</p>
            <p><strong>E-mail:</strong> $email</p>
            <p><strong>Área de Atuação:</strong> $area</p>
            <p><strong>Mensagem:</strong> $mensagem</p>
        ";

        // Enviar o e-mail
        $mail->send();

        // Alerta de sucesso e redirecionamento
        echo "<!DOCTYPE html>
              <html lang='pt-BR'>
              <head>
                  <meta charset='UTF-8'>
                  <meta name='viewport' content='width=device-width, initial-scale=1.0'>
                  <title>Formulário Enviado</title>
                  <script>
                      alert('E-mail enviado com sucesso!');
                      window.location.href = 'index.php';
                  </script>
              </head>
              <body>
              </body>
              </html>";
        exit;
    } catch (Exception $e) {
        // Alerta de erro e redirecionamento
        echo "<!DOCTYPE html>
              <html lang='pt-BR'>
              <head>
                  <meta charset='UTF-8'>
                  <meta name='viewport' content='width=device-width, initial-scale=1.0'>
                  <title>Erro ao Enviar</title>
                  <script>
                      alert('Erro ao enviar o e-mail: {$mail->ErrorInfo}');
                      window.location.href = 'index.php';
                  </script>
              </head>
              <body>
              </body>
              </html>";
        exit;
    }
} else {
    // Se o script for acessado diretamente, redireciona para a página inicial
    header('Location: index.php');
    exit;
}
?>