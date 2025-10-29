<?php 
 $api="http://127.0.0.1:8000/api/ANNEEE";
 if($serv['request method']==='post'&& isset($post['liban'])){

    $lib=['liban'=>$post['liban']];

    $control=['http'=>['header'=>"content-type:application/json\r\n",
                    'method'=>'post',
                 'content'=>json_encode($lib),]
];
    $stream=stream_context_create($control);
    $resul=file_get_contents($api,false,$stream);


    if($result===false){
        $message="erreur";
    }
    else{
        $message="reussite";
    }
 }
  
if(isset($_get['delete'])){
    $id=$_get['delete'];
    $url=$api."/".$id;
    $control= ['http'=>['method'=>'delete',]];
    $stream=stream_context_create($control);
    file_get_contents($url,false,$control);
    $message="annee supprime";
}
$annee=[];
$json=@file_get_contents($api);
if($json!==false){
    $annee=json_decode($json,true);
}
?>
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>ANNEE</title>
    <style>
        body{
            font-family:arial;
            margin:20px;
            background:#f5f5f5;
        }
        form{
            margin-bottom:15px;
        }
        table{
            border-collapse:collapse;
            width:60%;
            background:white;
        }
        th,td{
            padding:10px;
            border:1px solid  #ccc;
            text-align:left;
        }
        .msg{
            margin-bottom:10px;
            color:green;
        }
        button{
            background-color:#007bff;
            color:white;
            text-align:left;
        }
        buttom.delete{
            background-color:#dc3545;
        }
    </style>
</head>
<body>
    <H1>ANNEE</H1>
    <?php  if(isset($message))echo "<p class='msg'>$message </p>"; ?>

    <form method="post">
       <label>nouvelle annee</label>
       <input type="text" name="liban" placeholder="ex:2025" required>
       <button type="submit">ajouter</button>
    </form>

    <h2>liste des annees ajouter</h2>
    <?php if(!empty($annee)):?>
        <table>
            <tr><th>id</th><th>annee</th><th>libelle</th></tr>
            <?php foreach ($annee as $annees): ?>
                <tr>
                    <td><?=htmlspecialchars($annees['idan']) ?></td>
                    <td><?=htmlspecialchars($annees['liban']) ?></td>
                    <td> <a href="?delete=<?=$annees['id'] ?>">
                        <button class="delete">supprimer</button>
                    </a></td>
                </tr>
                <?php endforeach; ?>
        </table>
        <?php else: ?>
            <p>aucune annee trouvee</p>
            <?php endif; ?>
</body>
</html>