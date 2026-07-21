<?php

function jc_theme_setup() {
    add_theme_support( 'title-tag' );
    add_theme_support( 'post-thumbnails' );
    register_nav_menus( array(
        'primary' => __( 'Menú principal', 'jc-cardio' ),
    ) );
}
add_action( 'after_setup_theme', 'jc_theme_setup' );

function jc_enqueue_assets() {
    wp_enqueue_style( 'jc-google-fonts', 'https://fonts.googleapis.com/css2?family=Newsreader:ital,opsz,wght@0,6..72,400;0,6..72,500;0,6..72,600;1,6..72,500&family=Inter:wght@400;500;600&family=IBM+Plex+Mono:wght@500&display=swap', array(), null );
    wp_enqueue_style( 'jc-style', get_stylesheet_uri(), array(), '1.0' );

    wp_enqueue_script( 'jc-main', get_template_directory_uri() . '/js/main.js', array(), '1.0', true );
    wp_localize_script( 'jc-main', 'jcAjax', array(
        'url'   => admin_url( 'admin-post.php' ),
        'nonce' => wp_create_nonce( 'jc_contact_nonce' ),
    ) );
}
add_action( 'wp_enqueue_scripts', 'jc_enqueue_assets' );

function jc_customize_register( $wp_customize ) {
    $wp_customize->add_section( 'jc_contact_section', array(
        'title'    => __( 'Datos de contacto', 'jc-cardio' ),
        'priority' => 30,
    ) );

    $fields = array(
        'jc_whatsapp_number' => array( 'label' => 'Número de WhatsApp (solo dígitos, con código de país, ej: 50688888888)', 'default' => '50600000000' ),
        'jc_phone_display'   => array( 'label' => 'Teléfono a mostrar', 'default' => '+506 0000-0000' ),
        'jc_email'           => array( 'label' => 'Correo de contacto', 'default' => 'contacto@drjuliocascante.com' ),
        'jc_address'         => array( 'label' => 'Dirección del consultorio', 'default' => '[ Dirección — completar ]' ),
        'jc_hours'           => array( 'label' => 'Horario de atención', 'default' => '[ Días y horas — completar ]' ),
    );

    foreach ( $fields as $id => $field ) {
        $wp_customize->add_setting( $id, array(
            'default'           => $field['default'],
            'sanitize_callback' => 'sanitize_text_field',
        ) );
        $wp_customize->add_control( $id, array(
            'label'   => $field['label'],
            'section' => 'jc_contact_section',
            'type'    => 'text',
        ) );
    }
}
add_action( 'customize_register', 'jc_customize_register' );

function jc_handle_contact_submit() {
    if ( ! isset( $_POST['jc_contact_nonce'] ) || ! wp_verify_nonce( $_POST['jc_contact_nonce'], 'jc_contact_nonce' ) ) {
        wp_send_json_error( array( 'message' => 'No se pudo verificar la solicitud.' ) );
    }

    $name    = isset( $_POST['fname'] ) ? sanitize_text_field( $_POST['fname'] ) : '';
    $phone   = isset( $_POST['fphone'] ) ? sanitize_text_field( $_POST['fphone'] ) : '';
    $email   = isset( $_POST['femail'] ) ? sanitize_email( $_POST['femail'] ) : '';
    $service = isset( $_POST['fservice'] ) ? sanitize_text_field( $_POST['fservice'] ) : '';
    $message = isset( $_POST['fmsg'] ) ? sanitize_textarea_field( $_POST['fmsg'] ) : '';

    if ( empty( $name ) || empty( $phone ) || ! is_email( $email ) ) {
        wp_send_json_error( array( 'message' => 'Complete los campos requeridos con datos válidos.' ) );
    }

    $to      = get_theme_mod( 'jc_email', get_option( 'admin_email' ) );
    $subject = 'Nueva solicitud de cita — ' . $name;
    $body    = "Nombre: $name\nTeléfono: $phone\nCorreo: $email\nEstudio/consulta: $service\n\nMensaje:\n$message";
    $headers = array( 'Content-Type: text/plain; charset=UTF-8', 'Reply-To: ' . $email );

    $sent = wp_mail( $to, $subject, $body, $headers );

    if ( $sent ) {
        wp_send_json_success( array( 'message' => 'Solicitud enviada correctamente.' ) );
    } else {
        wp_send_json_error( array( 'message' => 'No se pudo enviar el mensaje. Intente de nuevo o escriba por WhatsApp.' ) );
    }
}
add_action( 'admin_post_jc_contact_submit', 'jc_handle_contact_submit' );
add_action( 'admin_post_nopriv_jc_contact_submit', 'jc_handle_contact_submit' );
