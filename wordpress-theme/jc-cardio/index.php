<?php get_header(); ?>
<div class="wrap" style="padding:100px 0;">
  <?php if ( have_posts() ) : while ( have_posts() ) : the_post(); ?>
    <h1><?php the_title(); ?></h1>
    <div><?php the_content(); ?></div>
  <?php endwhile; else : ?>
    <p><?php esc_html_e( 'No hay contenido para mostrar.', 'jc-cardio' ); ?></p>
  <?php endif; ?>
</div>
<?php get_footer(); ?>
